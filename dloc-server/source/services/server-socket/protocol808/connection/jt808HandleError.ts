import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import { printMessage } from "../../../../functions/printMessage";
import { clearItemInCacheIMEI } from "../../../../infraestucture/caches/cacheIMEI";

const jt808HandleError = (remoteAddress: string, imei: string, err: Error) => {
  const imeiTemp = getNormalizedIMEI(imei);

  printMessage(
    `[${imeiTemp}] (${remoteAddress}) ❌ connection error: [${err.message}]`
  );

  /** Clear cache for the imei */
  clearItemInCacheIMEI(imei);
};

export default jt808HandleError;
