import net from "node:net";

import { PowerProfileType } from "../../enums/PowerProfileType";
import convertStringToHexString from "../../functions/convertStringToHexString";
import { getNormalizedIMEI } from "../../functions/getNormalizedIMEI";
import getPowerProfile from "../../functions/getPowerProfile";
import { printMessage } from "../../functions/printMessage";
import processPacketHealth from "../../functions/processPacketHealth";
import { getRemoteAddress } from "../../functions/remoteAddress";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../infraestucture/caches/cacheIMEI";
import { CacheImei } from "../../infraestucture/models/CacheImei";
import { HandlePacketResult } from "../../models/HandlePacketResult";
import { Persistence } from "../../models/Persistence";
import ServerSocketHandlerProcess from "../../models/ServerSocketHandlerProcess";
import Proto1903HandlePacket from "../../services/server-socket/protocol1903/models/Proto1903HandlePacket";
import Proto1903HandlerProps from "../../services/server-socket/protocol1903/models/Proto1903HandlerProps";
import Jt808HandlePacket from "../../services/server-socket/protocol808/models/Jt808HandlePacket";
import Jt808HandlerProps from "../../services/server-socket/protocol808/models/Jt808HandlerProps";

// TODO: [REFACTOR] Unificar handlers para protocolo 808 y 1903

const serverSocketHandler = (
  protocol: "PROTO1903" | "JT808",
  conn: net.Socket,
  persistence: Persistence,
  serverSocketHandlerProcess: ServerSocketHandlerProcess,
  handlePacket: Proto1903HandlePacket | Jt808HandlePacket,
  handler: ({
    imei,
    remoteAddress,
    data,
    handlePacket,
    persistence,
    counter,
  }: Proto1903HandlerProps | Jt808HandlerProps) => Promise<
    HandlePacketResult[]
  >,
  handleClose: (remoteAddress: string, imei: string) => void,
  handleEnd: (remoteAddress: string, imei: string) => void,
  handleError: (remoteAddress: string, imei: string, err: Error) => void
) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var newConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => handleClose(remoteAddress, imei));
  conn.on("end", () => handleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => handleError(remoteAddress, imei, err));

  /** Handle data */
  conn.on("data", (data: Buffer) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataString: string = data.toString();
    const dataShow: string =
      protocol === "PROTO1903" ? dataString : convertStringToHexString(data);
    const dataToUse = protocol === "PROTO1903" ? dataString : data;

    counter++;
    if (counter > 32000) counter = 1;

    try {
      /** Check if health packet */
      if (processPacketHealth(conn, dataString, remoteAddress, tempImei))
        return;

      /** New socket connection */
      if (newConnection)
        printMessage(`[${tempImei}] (${remoteAddress}) 🧑‍💻 new connection.`);

      /** Handle data */
      handler({
        imei,
        remoteAddress,
        data: dataToUse as any,
        handlePacket: handlePacket as any,
        persistence,
        conn,
        counter,
      })
        .then(async (results) => {
          if (!results[0]?.imei) {
            printMessage(
              `[${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataShow}].`
            );
            conn.destroy();
            return;
          }
          imei = results[0].imei;
          const prefix = `[${imei}] (${remoteAddress})`;

          for (const result of results) {
            if (result.mustDisconnect) {
              printMessage(
                `[${tempImei}] (${remoteAddress}) ❌ Connection must be closed. (Request by the platform)`
              );
              conn.destroy();
              return;
            }
          }

          printMessage(`${prefix} 🌟 Current serial counter [${counter}].`);

          /** Get the las information about the IMEI */
          const imeiData: CacheImei = CACHE_IMEI.get(imei) ?? {
            powerProfile: PowerProfileType.AUTOMATIC_MINIMAL,
            lastPowerProfileChecked: 0,
            lastLBSRequestTimestamp: 0,
            socketConn: conn,
            lastReportRequestTimestamp: 0,
          };

          /** Get power profile for the imei */
          const {
            powerProfile: newPowerProfile,
            lastPowerProfileChecked,
            needProfileRefresh,
            movementsControlSeconds,
          } = await getPowerProfile(
            imei,
            persistence,
            imeiData.lastPowerProfileChecked,
            prefix,
            newConnection
          );

          /** create or update socket connection to cache */
          CACHE_IMEI.updateOrCreate(imei, {
            socketConn: conn,
            powerProfile: newPowerProfile,
            lastPowerProfileChecked,
          });

          const powerPrfChanged = imeiData.powerProfile !== newPowerProfile;

          serverSocketHandlerProcess({
            conn,
            results,
            imei,
            prefix,
            counter,
            newConnection,
            powerPrfChanged,
            needProfileRefresh,
            imeiData,
            newPowerProfile,
            movementsControlSeconds,
          });
          newConnection = false;

          //
        })
        .catch((err: Error) => {
          throw err;
        });
    } catch (err: Error | any) {
      conn.destroy();

      /** Clear cache for the imei */
      clearItemInCacheIMEI(imei);

      printMessage(
        `[${tempImei}] (${remoteAddress}) ❌ error handling data (${
          err?.message ?? "unknown error"
        }) data [${dataShow}].`
      );
    }
  });
};

export default serverSocketHandler;
