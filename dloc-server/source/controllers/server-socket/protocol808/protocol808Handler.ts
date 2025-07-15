import net from "node:net";
import { PowerProfileType } from "../../../enums/PowerProfileType";
import convertStringToHexString from "../../../functions/convertStringToHexString";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import getPowerProfile from "../../../functions/getPowerProfile";
import { printMessage } from "../../../functions/printMessage";
import processPacketHealth from "../../../functions/processPacketHealth";
import { getRemoteAddress } from "../../../functions/remoteAddress";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../../infraestucture/caches/cacheIMEI";
import { Persistence } from "../../../models/Persistence";
import handleClose from "../../../services/server-socket/protocol808/connection/handleClose";
import handleEnd from "../../../services/server-socket/protocol808/connection/handleEnd";
import handleError from "../../../services/server-socket/protocol808/connection/handleError";
import { handlePacket } from "../../../services/server-socket/protocol808/connection/handlePacket";
import jt808CheckMustSendToTerminal from "../../../services/server-socket/protocol808/functions/jt808CheckMustSendToTerminal";
import jt808FrameEncode from "../../../services/server-socket/protocol808/functions/jt808FrameEncode";
import handler from "../../../services/server-socket/protocol808/handler";

// TODO: [REFACTOR] Unificar handlers para protocolo 808 y 1903

const protocol808Handler = (conn: net.Socket, persistence: Persistence) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var newConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => handleClose(remoteAddress, imei));
  conn.on("end", () => handleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => handleError(remoteAddress, imei, err));

  /** Handle data */
  conn.on("data", (data: any) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataString: string =
      typeof data === "string" ? data : convertStringToHexString(data);

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
        data,
        handlePacket,
        persistence,
        conn,
        counter,
      })
        .then(async (results) => {
          if (!results[0]?.imei) {
            printMessage(
              `${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataString}].`
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
          const imeiData = CACHE_IMEI.get(imei) ?? {
            powerProfile: PowerProfileType.AUTOMATIC_MINIMAL,
            lastPowerProfileChecked: 0,
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

          if (newConnection || powerPrfChanged || needProfileRefresh) {
            const responseSend: Buffer[] = jt808CheckMustSendToTerminal(
              imei,
              prefix,
              powerPrfChanged,
              needProfileRefresh,
              counter,
              imeiData.powerProfile,
              newPowerProfile,
              movementsControlSeconds
            );

            responseSend.forEach((response) => {
              (results[0].response as Buffer[]).push(response);
            });

            /** Is not a new connection */
            newConnection = false;
          }

          /** Send */
          for (const result of results) {
            for (const response of result.response) {
              conn.write(jt808FrameEncode(response as Buffer));
              conn.write(Buffer.alloc(0));
            }
          }
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
        }) data [${dataString}].`
      );
    }
  });
};

export { protocol808Handler };
