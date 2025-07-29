import net from 'node:net';
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import { printMessage } from "../../../functions/printMessage";

 const serverSocketSendData = (imei: string, remoteAddress: string, conn: net.Socket, data: Buffer[] | String[]) => {
    if (!conn || conn.destroyed) {
      printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Connection is already closed.`);
      return;
    }

    const showError = (err: Error) => {
      printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Error sending data: ${err.message}`);
    };

    for (const dataItem of data) {
      if (typeof dataItem === "string") {
        conn.write(dataItem, (err?: Error) => {
          if (err) showError(err);
          // else printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) 📡 Sent data: ${dataItem}`);
        });
      } else if (dataItem instanceof Buffer) {
        conn.write(dataItem, (err?: Error) => {
          if (err) showError(err);
          // TODO: [DEBUG] Remove this when the protocol (topin) is stable
          else printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) 📡 Sent data: ${dataItem.toString('hex')}`);
        });
        conn.write(Buffer.alloc(0)); // Send an empty buffer to indicate end of packet
      } else {
        printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Unsupported data type: ${typeof dataItem}.`);
      }
    }
  };

export default serverSocketSendData;