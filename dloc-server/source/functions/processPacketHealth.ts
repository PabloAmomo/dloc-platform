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
  data: string,
  remoteAddress: string,
  imei: string,
  sendData: (data: string[]) => void,
  disconnect: () => void
): boolean => {

  if (data.toUpperCase().indexOf("HEAD /HEALTH") === -1) return false;

  if (!remoteAddress.includes("127.0.0.1"))
    printMessage(`[${imei}] (${remoteAddress}) 🩺 health packet received.`);
  sendData([HTTP_200]);
  disconnect();
  return true;
};

export default processPacketHealth;
