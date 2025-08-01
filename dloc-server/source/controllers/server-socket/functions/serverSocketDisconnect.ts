import net from 'node:net';
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import { printMessage } from "../../../functions/printMessage";
import { clearItemInCacheIMEI } from '../../../infraestucture/caches/cacheIMEI';
import isLocalIp from '../../../functions/isLocalIp';

 const serverSocketDisconnect = (imei: string, remoteAddress: string, conn: net.Socket) => {
    conn.destroy();
    clearItemInCacheIMEI(imei);
    if (!isLocalIp(remoteAddress)) 
      printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Connection closed.`);
  };

export default serverSocketDisconnect;