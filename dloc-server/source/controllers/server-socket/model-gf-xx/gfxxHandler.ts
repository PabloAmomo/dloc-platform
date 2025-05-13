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

const heartbeatInterval: string = "180"; // seconds
const uploadInterval: string = "0020"; // seconds
const ledDisplay: string = "0"; // 0: off, 1: on
const forceReportLocInterval: string = "60"; // 0: off, 1...720: on [every seconds]

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
  conn.once("close", () => handleClose(remoteAddress));
  conn.on("end", () => handleEnd(remoteAddress));
  conn.on("error", (err: Error) => handleError(remoteAddress, err));

  /** Handle data */
  conn.on("data", (data: any) => {
    const tempImei: string = imei !== "" ? imei : "---------------";
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
        printMessage(`[---------------] (${remoteAddress}) new connection.`);

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

          /** Save response to send */
          let toSend: string = "";
          for (let i = 0; i < results.length; i++) {
            if (results[i].response !== "") toSend += results[i].response;
          }

          /** If new connection send configuration after response */
          if (newConnection) {
            // get five digits of timestamp
            const timestamp: string = (Date.now() / 1000).toFixed(0).slice(-6);

            printMessage(
              `[${imei}] (${remoteAddress}) send command HeartBeat [${heartbeatInterval}] - Leds [${ledDisplay}] - Upload Interval [${uploadInterval}]`
            );

            // Set heartbeat packet interval (issue: dp03, reply: cp03)
            toSend += `TRVDP03${timestamp},${heartbeatInterval}#`;
            // Set LED display switch (up: AP92; down: bp92)
            toSend += `TRVBP92${timestamp + 1}${ledDisplay}#`;
            // Set upload interval (downlink protocol No.: wp02, response: xp02)
            toSend += `TRVWP02${timestamp + 2}${uploadInterval}#`;
            // Add force report location interval
            toSend += "TRVBP20#";

            newConnection = false;
          }

          /** send TRVBP20# every minute (Force to report Position) */
          const lastPositionPacket: PositionPacketWithDatetime | undefined =
            CACHE_POSITION.get(imei);
            
          const lastPositionSince = !lastPositionPacket
            ? parseInt(forceReportLocInterval) * 2 * 1000
            : Date.now() - lastPositionPacket.datetimeUtc.getTime();

          if (
            parseInt(forceReportLocInterval) > 0 &&
            lastPositionSince > 1000 * parseInt(forceReportLocInterval) &&
            Date.now() - lastTime > parseInt(forceReportLocInterval) * 1000
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
      printMessage(
        `[${tempImei}] (${remoteAddress}) error handling data (${
          err?.message ?? "unknown error"
        }) data [${data}].`
      );
    }
  });
};

export { gfxxHandler as gfxxHandler };
