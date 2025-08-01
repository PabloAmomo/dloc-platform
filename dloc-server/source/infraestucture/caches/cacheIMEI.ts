import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";
import { PowerProfileType } from "../../enums/PowerProfileType";
import { CacheImei } from "../models/CacheImei";

/** Start IMEI Cache */
export var CACHE_IMEI: Cache<CacheImei>;

/** IMEI cahce init */
function initCacheIMEI() {
  printMessage(`✅ IMEI (Devices) cache initialized`);

  CACHE_IMEI = new Cache<CacheImei>(0); // no expiration
}

/** Clear cache for the imei */
function clearItemInCacheIMEI(imei: string) {
  if (imei === "") return;

  CACHE_IMEI.updateOrCreate(imei, {
    powerProfile: PowerProfileType.AUTOMATIC_FULL,
    lastPowerProfileChecked: 0,
    lastLBSRequestTimestamp: 0,
    lastLBSKey: "",
    lastReportRequestTimestamp: 0,
  });
}

export { initCacheIMEI, clearItemInCacheIMEI };
