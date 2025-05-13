import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";

/** Start IMEI Cache */
export var CACHE_IMEI: Cache<{
  lastLBSRequestTimestamp: number;
}>;

/** IMEI cahce init */
function initCacheIMEI() {
  printMessage(`IMEI database cache initialized`);

  CACHE_IMEI = new Cache<{
    lastLBSRequestTimestamp: number;
  }>(0); // no expiration
}

export { initCacheIMEI };
