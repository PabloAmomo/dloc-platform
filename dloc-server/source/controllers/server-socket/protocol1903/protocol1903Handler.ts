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
import { PositionPacketWithDatetime } from "../../../models/PositionPacketWithDatetime";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../../infraestucture/caches/cacheIMEI";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import powerProfileConfigGFxx from "../../../functions/powerProfileConfig";
import proto1903CreateConfig from "../../../services/server-socket/protocol1903/functions/proto1903CreateConfig";
import getPowerProfile from "../../../functions/getPowerProfile";

const HTTP_200 = `${[
  "HTTP/1.1 200 OK",
  "Content-Type: text/html; charset=UTF-8",
  "Content-Encoding: UTF-8",
  "Accept-Ranges: bytes",
  "Connection: keep-alive",
].join("\n")}\n\n`;

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

    counter++;
    if (counter > 32000) counter = 1;

    try {
      /** Process data */
      const dataString: string = data.toString();

      /** Check if health packet */
      if (dataString.indexOf("HEAD /health") !== -1) {
        if (!remoteAddress.includes("127.0.0.1"))
          printMessage(
            `[${tempImei}] (${remoteAddress}) 🩺 health packet received.`
          );
        conn.write(HTTP_200);
        conn.destroy();
        return;
      }

      /** New socket connection */
      if (newConnection)
        printMessage(`[${tempImei}] (${remoteAddress}) 🧑‍💻 new connection.`);

      /** Handle data */
      handler({
        imei,
        remoteAddress,
        data: dataString,
        handlePacket,
        persistence,
        conn,
        counter,
      })
        .then(async (results) => {
          /** Check if IMEI is valid */
          if (!results[0]?.imei) {
            printMessage(`${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataString}].`);
            conn.destroy();
            return;
          }
          imei = results[0].imei;

          const prefix = `[${imei}] (${remoteAddress})`;

          printMessage(`${prefix} 🌟 Current serial counter [${counter}].`);
          
          /** Get the las information about the IMEI */
          const imeiData = CACHE_IMEI.get(imei);

          /** Get power profile for the imei */
          const { powerProfile, lastPowerProfileChange } =
            await getPowerProfile(
              imei,
              persistence,
              imeiData?.lastPowerProfileChange ?? 0,
              prefix
            );
          const { heartBeatSec, uploadSec, ledState, forceReportLocInMs } =
            powerProfileConfigGFxx(powerProfile);

          /** Get last position packet */
          const lastPosPacket: PositionPacketWithDatetime | undefined =
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
            lastPowerProfileChange,
          });
          const powerPrfChanged =
            imeiData?.powerProfile && imeiData?.powerProfile !== powerProfile;

          /** If new connection send configuration after response */
          if (newConnection || powerPrfChanged) {
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
        }) data [${data}].`
      );
    }
  });
};

export { protocol1903Handler };
