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
import handleClose from "../../../services/server-socket/protocol1903/connection/handleClose";
import handleEnd from "../../../services/server-socket/protocol1903/connection/handleEnd";
import handleError from "../../../services/server-socket/protocol1903/connection/handleError";
import { handlePacket } from "../../../services/server-socket/protocol1903/connection/handlePacket";
import handler from "../../../services/server-socket/protocol1903/handler";
import { protocol1903HanlderProcess } from "./protocol1903HandletProcess";
import proto1903MustSendToTerminalRequestReport from "../../../services/server-socket/protocol1903/functions/proto1903MustSendToTerminalRequestReport";
import proto1903CheckMustSendToTerminal from "../../../services/server-socket/protocol1903/functions/proto1903CheckMustSendToTerminal";

// TODO: [REFACTOR] Unificar handlers para protocolo 808 y 1903

const protocol1903Handler = (conn: net.Socket, persistence: Persistence) => {
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
      handler({
        imei,
        remoteAddress,
        data: dataToUse,
        handlePacket,
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

          // TODO: [BUG] Solve problem 
          //protocol1903HanlderProcess({
          //  conn,
          //  results,
          //  imei,
          //  prefix,
          //  counter,
          //  newConnection,
          //  powerPrfChanged,
          //  needProfileRefresh,
          //  imeiData,
          //  newPowerProfile,
          //  movementsControlSeconds,
          //});

          let toSendAditional: string = "";
          if (newConnection || powerPrfChanged || needProfileRefresh) {
            const responseSend: string = proto1903CheckMustSendToTerminal(
              imei,
              prefix,
              powerPrfChanged,
              needProfileRefresh,
              imeiData.powerProfile,
              newPowerProfile
            );
            toSendAditional += responseSend;

            newConnection = false;
          }
          /** Check if must send to terminal request report */
          if (
            proto1903MustSendToTerminalRequestReport(
              imei,
              newPowerProfile,
              imeiData
            )
          ) {
            toSendAditional += "TRVBP20#";
            printMessage(
              `${prefix} 📡 send command TRVBP20 (Force to report Position).`
            );
          }
          /** Create response to send */
          let toSend: string = "";
          for (let i = 0; i < results.length; i++) {
            if (results[i].response.length > 0)
              toSend += results[i].response.join("");
          }
          if (toSendAditional) toSend += toSendAditional;
          conn.write(toSend);

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

export { protocol1903Handler };
