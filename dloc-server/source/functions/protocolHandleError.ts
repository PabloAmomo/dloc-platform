import { clearItemInCacheIMEI } from "../infraestucture/caches/cacheIMEI";
import { getNormalizedIMEI } from "./getNormalizedIMEI";
import { printMessage } from "./printMessage";

const protocolHandleError = (remoteAddress: string, imei: string, err: Error) => {
  const imeiTemp = getNormalizedIMEI(imei);

  printMessage(
    `[${imeiTemp}] (${remoteAddress}) ❌ connection error: [${err.message}]`
  );

  /** Clear cache for the imei */
  clearItemInCacheIMEI(imei);
};

export default protocolHandleError;
