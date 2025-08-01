import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import { printMessage } from "../../../../functions/printMessage";
import { clearItemInCacheIMEI } from "../../../../infraestucture/caches/cacheIMEI";

const proto1903HandleClose = (remoteAddress: string, imei: string) => {
  const imeiTemp = getNormalizedIMEI(imei);

  if (!remoteAddress.includes("127.0.0.1"))
    printMessage(`[${imeiTemp}] (${remoteAddress}) 🚫 connection closed.`);

  /** Clear cache for the imei */
  clearItemInCacheIMEI(imei);
};

export default proto1903HandleClose;
