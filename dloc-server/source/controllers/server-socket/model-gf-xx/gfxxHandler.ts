import { handlePacket } from "../../../services/server-socket/model-gf-xx/handlePacket";
import { Persistence } from "../../../models/Persistence";
import { printMessage } from "../../../functions/printMessage";
import { getRemoteAddress } from "../../../functions/remoteAddress";
import handleClose from "../../../services/server-socket/model-gf-xx/connection/handleClose";
import handleData from "../../../services/server-socket/model-gf-xx/connection/handleData";
import handleEnd from "../../../services/server-socket/model-gf-xx/connection/handleEnd";
import handleError from "../../../services/server-socket/model-gf-xx/connection/handleError";
import net from "node:net";
import { CACHE_POSITION } from "../../../infraestucture/caches/cachePosition";
import { PositionPacketWithDatetime } from "../../../models/PositionPacketWithDatetime";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../../infraestucture/caches/cacheIMEI";
import { uniqueId } from "../../../functions/uniqueId";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import powerProfileConfig from "../../../functions/powerProfileConfig";

const HTTP_200 = `${[
  "HTTP/1.1 200 OK",
  "Content-Type: text/html; charset=UTF-8",
  "Content-Encoding: UTF-8",
  "Accept-Ranges: bytes",
  "Connection: keep-alive",
].join("\n")}\n\n`;

const gfxxHandler = (conn: net.Socket, persistence: Persistence) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var lastTime: number = Date.now();
  var newConnection: boolean = true;

  /** Create event listeners for socket connection */
  conn.once("close", () => handleClose(remoteAddress, imei));
  conn.on("end", () => handleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => handleError(remoteAddress, imei, err));

  /** Handle data */
  conn.on("data", (data: any) => {
    const tempImei: string = getNormalizedIMEI(imei);
    try {
      /** Process data */
      const dataString: string = data.toString();

      /** Check if health packet */
      if (dataString.indexOf("HEAD /health") !== -1) {
        if (!remoteAddress.includes("127.0.0.1"))
          printMessage(
            `[${tempImei}] (${remoteAddress}) health packet received.`
          );
        conn.write(HTTP_200);
        conn.destroy();
        return;
      }

      /** New socket connection */
      if (newConnection)
        printMessage(`[${tempImei}] (${remoteAddress}) new connection.`);

      /** Handle data */
      handleData({
        imei,
        remoteAddress,
        data: dataString,
        handlePacket,
        persistence,
        conn,
      })
        .then((results) => {
          imei = results[0].imei;

          /** Get last position packet */
          const lastPosacket: PositionPacketWithDatetime | undefined =
            CACHE_POSITION.get(imei);

          /** create or update socket connection to cache */
          CACHE_IMEI.updateOrCreate(imei, {
            socketConn: conn,
          });

          /** Save response to send */
          let toSend: string = "";
          for (let i = 0; i < results.length; i++) {
            if (results[i].response !== "") toSend += results[i].response;
          }

          const { heartBeatSec, uploadSec, ledState, forceReportLocInMs } =
            powerProfileConfig("full");

          /** If new connection send configuration after response */
          if (newConnection) {
            // get five digits of timestamp
            const timestamp: string = uniqueId();

            printMessage(
              `[${imei}] (${remoteAddress}) send command (${timestamp}) HeartBeat [${heartBeatSec}] - Leds [${ledState}] - Upload Interval [${uploadSec}]`
            );

            // Set heartbeat packet interval (issue: dp03, reply: cp03)
            toSend += `TRVDP03${timestamp},${heartBeatSec}#`;
            // Set LED display switch (up: AP92; down: bp92)
            toSend += `TRVBP92${parseInt(timestamp) + 1}${ledState}#`;
            // Set upload interval (downlink protocol No.: wp02, response: xp02)
            toSend += `TRVWP02${parseInt(timestamp) + 2}${uploadSec}#`;
            // Add force report location interval
            toSend += "TRVBP20#";

            newConnection = false;
          }

          const lastPosMsSec = !lastPosacket
            ? forceReportLocInMs
            : Date.now() - lastPosacket.datetimeUtc.getTime();

          if (
            forceReportLocInMs > 0 &&
            lastPosMsSec >= forceReportLocInMs &&
            Date.now() - lastTime >= forceReportLocInMs
          ) {
            lastTime = Date.now();
            toSend += "TRVBP20#";
            printMessage(
              `[${imei}] (${remoteAddress}) send command TRVBP20 (Force to report Position).`
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
        `[${tempImei}] (${remoteAddress}) error handling data (${
          err?.message ?? "unknown error"
        }) data [${data}].`
      );
    }
  });
};

export { gfxxHandler as gfxxHandler };
