import { clearItemInCacheIMEI } from "../infraestucture/caches/cacheIMEI";
import { getNormalizedIMEI } from "./getNormalizedIMEI";
import isLocalIp from "./isLocalIp";
import { printMessage } from "./printMessage";


const protocolHandleClose = (remoteAddress: string, imei: string) => {
  const imeiTemp = getNormalizedIMEI(imei);

  if (!isLocalIp(remoteAddress))
    printMessage(`[${imeiTemp}] (${remoteAddress}) 🚫 connection closed.`);

  /** Clear cache for the imei */
  clearItemInCacheIMEI(imei);
};

export default protocolHandleClose;
