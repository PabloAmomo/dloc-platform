import net from 'node:net';
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import { printMessage } from "../../../functions/printMessage";
import { clearItemInCacheIMEI } from '../../../infraestucture/caches/cacheIMEI';

 const serverSocketDisconnect = (imei: string, remoteAddress: string, conn: net.Socket) => {
    conn.destroy();
    clearItemInCacheIMEI(imei);
    if (!remoteAddress.includes("127.0.0.1"))
      printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Connection closed.`);
  };

export default serverSocketDisconnect;