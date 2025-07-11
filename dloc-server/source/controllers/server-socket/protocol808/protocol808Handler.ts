import { handlePacket } from "../../../services/server-socket/protocol808/connection/handlePacket";
import { Persistence } from "../../../models/Persistence";
import { printMessage } from "../../../functions/printMessage";
import { getRemoteAddress } from "../../../functions/remoteAddress";
import handleClose from "../../../services/server-socket/protocol808/connection/handleClose";
import handler from "../../../services/server-socket/protocol808/handler";
import handleEnd from "../../../services/server-socket/protocol808/connection/handleEnd";
import handleError from "../../../services/server-socket/protocol808/connection/handleError";
import net from "node:net";
import { CACHE_POSITION } from "../../../infraestucture/caches/cachePosition";
import { PositionPacketWithDatetime } from "../../../models/PositionPacketWithDatetime";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../../infraestucture/caches/cacheIMEI";
import {
  getNormalizedIMEI,
  NO_IMEI_STRING,
} from "../../../functions/getNormalizedIMEI";
import powerProfileConfigGFxx from "../../../functions/powerProfileConfig";
import getPowerProfile from "../../../functions/getPowerProfile";
import convertStringToHexString from "../../../functions/convertStringToHexString";
import jt808FrameEncode from "../../../services/server-socket/protocol808/functions/jt808FrameEncode";

const HTTP_200 = `${[
  "HTTP/1.1 200 OK",
  "Content-Type: text/html; charset=UTF-8",
  "Content-Encoding: UTF-8",
  "Accept-Ranges: bytes",
  "Connection: keep-alive",
].join("\n")}\n\n`;

// TODO: Unificar handlers para protocolo 808 y 1903 (Funcion protocolXXXHandler.ts)

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
    const dataStringHex: string = convertStringToHexString(data);

    counter++;
    if (counter > 32000) counter = 1;

    try {
      /** Check if health packet */
      if ((data as string).indexOf("HEAD /health") !== -1) {
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
        data,
        handlePacket,
        persistence,
        conn,
        counter,
      })
        .then(async (result) => {
          if (!result?.imei) {
            printMessage(
              `[${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataStringHex}].`
            );
            conn.destroy();
            return;
          }
          imei = result.imei;

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

            // toSend += createConfigGFxx(powerProfile);

            newConnection = false;
          }

          /** Send */
          for (const response of result.response) {
            conn.write(jt808FrameEncode(response as Buffer));
            conn.write(Buffer.alloc(0)); 
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
        }) data [${dataStringHex}].`
      );
    }
  });
};

export { protocol808Handler };
