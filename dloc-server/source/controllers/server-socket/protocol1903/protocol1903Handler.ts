import { handlePacket } from "../../../services/server-socket/protocol1903/connection/handlePacket";
import { Persistence } from "../../../models/Persistence";
import { printMessage } from "../../../functions/printMessage";
import { getRemoteAddress } from "../../../functions/remoteAddress";
import handleClose from "../../../services/server-socket/protocol1903/connection/handleClose";
import handler from "../../../services/server-socket/protocol1903/handler";
import handleEnd from "../../../services/server-socket/protocol1903/connection/handleEnd";
import handleError from "../../../services/server-socket/protocol1903/connection/handleError";
import net from "node:net";
import { CACHE_POSITION } from "../../../infraestucture/caches/cachePosition";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../../infraestucture/caches/cacheIMEI";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import powerProfileConfig from "../../../functions/powerProfileConfig";
import proto1903CreateConfig from "../../../services/server-socket/protocol1903/functions/proto1903CreateConfig";
import getPowerProfile from "../../../functions/getPowerProfile";
import { CachePosition } from "../../../infraestucture/models/CachePosition";
import processPacketHealth from "../../../functions/processPacketHealth";
import convertStringToHexString from "../../../functions/convertStringToHexString";

// TODO: Unificar handlers para protocolo 808 y 1903

const protocol1903Handler = (conn: net.Socket, persistence: Persistence) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var lastTime: number = Date.now();
  var newConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => handleClose(remoteAddress, imei));
  conn.on("end", () => handleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => handleError(remoteAddress, imei, err));

  /** Handle data */
  conn.on("data", (data: any) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataHexString: string = convertStringToHexString(data);
    const dataString: string = data.toString();

    counter++;
    if (counter > 32000) counter = 1;

    try {
      /** Check if health packet */
      if (processPacketHealth(conn, data.toString(), remoteAddress, tempImei))
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
          /** Check if IMEI is valid */
          if (!results[0]?.imei) {
            printMessage(
              `${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataString}].`
            );
            conn.destroy();
            return;
          }
          imei = results[0].imei;

          const prefix = `[${imei}] (${remoteAddress})`;

          printMessage(`${prefix} 🌟 Current serial counter [${counter}].`);

          /** Get the las information about the IMEI */
          const imeiData = CACHE_IMEI.get(imei);

          /** Get power profile for the imei */
          const { powerProfile, lastPowerProfileChecked, needProfileRefresh } =
            await getPowerProfile(
              imei,
              persistence,
              imeiData?.lastPowerProfileChecked ?? Date.now(),
              prefix,
              newConnection
            );
          const { heartBeatSec, uploadSec, ledState, forceReportLocInMs } =
            powerProfileConfig(powerProfile);

          /** Get last position packet */
          const lastPosPacket: CachePosition | undefined =
            CACHE_POSITION.get(imei);

          /** Create response to send */
          let toSend: string = "";
          for (let i = 0; i < results.length; i++) {
            if (results[i].response.length > 0) {
              for (const response of results[i].response) {
                toSend += response;
              }
            }
          }

          /** create or update socket connection to cache */
          CACHE_IMEI.updateOrCreate(imei, {
            socketConn: conn,
            powerProfile,
            lastPowerProfileChecked,
          });
          const powerPrfChanged =
            imeiData?.powerProfile && imeiData?.powerProfile !== powerProfile;

          /** If new connection send configuration after response */
          if (newConnection || powerPrfChanged || needProfileRefresh) {
            if (needProfileRefresh) {
              printMessage(
                `${prefix} 🔄 power profile refresh needed, current profile [${powerProfile}]`
              );
            }

            if (powerPrfChanged)
              printMessage(
                `${prefix} ⚡️ power profile changed from [${imeiData?.powerProfile}] to [${powerProfile}]`
              );

            printMessage(
              `${prefix} 📡 send HeartBeat [${heartBeatSec} sec] - Leds [${ledState}] - Upload Interval [${uploadSec} sec] - forceUpdateLoc [${
                forceReportLocInMs / 1000
              } sec]`
            );

            toSend += proto1903CreateConfig(powerProfile);

            newConnection = false;
          }

          const currentTime = Date.now();

          const lastPosMsSec = !lastPosPacket
            ? forceReportLocInMs
            : currentTime - lastPosPacket.datetimeUtc.getTime();

          if (
            forceReportLocInMs > 0 &&
            lastPosMsSec >= forceReportLocInMs &&
            currentTime - lastTime >= forceReportLocInMs
          ) {
            lastTime = currentTime;
            toSend += "TRVBP20#";
            printMessage(
              `${prefix} 📡 send command TRVBP20 (Force to report Position).`
            );
          }

          /** Send */
          conn.write(toSend);
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

export { protocol1903Handler };
