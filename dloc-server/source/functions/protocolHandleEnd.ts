import { clearItemInCacheIMEI } from "../infraestucture/caches/cacheIMEI";
import { getNormalizedIMEI } from "./getNormalizedIMEI";
import { printMessage } from "./printMessage";


const protocolHandleEnd = (remoteAddress: string, imei: string) => {
  const imeiTemp = getNormalizedIMEI(imei);

  printMessage(`[${imeiTemp}] (${remoteAddress}) 🚫 connection closed.`);

  /** Clear cache for the imei */
  clearItemInCacheIMEI(imei);
};

export default protocolHandleEnd;