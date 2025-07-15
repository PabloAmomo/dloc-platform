import net from "node:net";

import { PowerProfileType } from "../../../enums/PowerProfileType";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import getPowerProfile from "../../../functions/getPowerProfile";
import { printMessage } from "../../../functions/printMessage";
import processPacketHealth from "../../../functions/processPacketHealth";
import { getRemoteAddress } from "../../../functions/remoteAddress";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../../infraestucture/caches/cacheIMEI";
import { CacheImei } from "../../../infraestucture/models/CacheImei";
import { Persistence } from "../../../models/Persistence";
import proto1903HandleClose from "./connection/proto1903HandleClose";
import proto1903HandleEnd from "./connection/proto1903HandleEnd";
import proto1903HandleError from "./connection/proto1903HandleError";
import proto1903HandlePacket from "./connection/proto1903HandlePacket";
import proto1903HandleConnection from "./connection/proto1903HandleConnection";
import proto1903Process from "./Proto1903Process";

const proto1903Ingress = (conn: net.Socket, persistence: Persistence) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var newConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => proto1903HandleClose(remoteAddress, imei));
  conn.on("end", () => proto1903HandleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) =>
    proto1903HandleError(remoteAddress, imei, err)
  );

  /** Handle data */
  conn.on("data", (data: Buffer) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataString: string = data.toString();
    const dataShow: string = data.toString();
    const dataToUse: string = data.toString();

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
      proto1903HandleConnection({
        imei,
        remoteAddress,
        data: dataToUse,
        handlePacket: proto1903HandlePacket,
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

          proto1903Process({
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

export default proto1903Ingress;
