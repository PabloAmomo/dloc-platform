import net from "node:net";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import { printMessage } from "../../../functions/printMessage";
import config from "../../../config/config";

const serverSocketSendData = (imei: string, remoteAddress: string, conn: net.Socket, data: Buffer[] | string[]) => {
  if (!conn || conn.destroyed) {
    printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Connection is already closed.`);
    return;
  }

  const showError = (err: Error) => {
    printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Error sending data: ${err.message}`);
  };

  for (const dataItem of data) {
    if (data.length === 0) continue; // Skip if no data to send

    if (typeof dataItem === "string") {
      conn.write(dataItem, (err?: Error) => {
        if (err) showError(err);
      });
    } else if (dataItem instanceof Buffer) {
      conn.write(dataItem, (err?: Error) => {
        if (err) showError(err);
        else if (config.SHOW_PACKETS_SENT)
          printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) 📡 Sent data: ${dataItem.toString("hex")}`);
      });
      conn.write(Buffer.alloc(0)); // Send an empty buffer to indicate end of packet
    } else {
      printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Unsupported data type: ${typeof dataItem}.`);
    }
  }
};

export default serverSocketSendData;
