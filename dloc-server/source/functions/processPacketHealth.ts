import net from "node:net";
import { printMessage } from "./printMessage";

const HTTP_200 = `${[
  "HTTP/1.1 200 OK",
  "Content-Type: text/html; charset=UTF-8",
  "Content-Encoding: UTF-8",
  "Accept-Ranges: bytes",
  "Connection: keep-alive",
].join("\n")}\n\n`;

const processPacketHealth = (
  conn: net.Socket,
  data: string,
  remoteAddress: string,
  imei: string
): boolean => {
  if (data.indexOf("HEAD /HEALTH".toUpperCase()) === -1) return false;

  if (!remoteAddress.includes("127.0.0.1"))
    printMessage(`[${imei}] (${remoteAddress}) 🩺 health packet received.`);
  conn.write(HTTP_200);
  conn.destroy();
  return true;
};

export default processPacketHealth;
