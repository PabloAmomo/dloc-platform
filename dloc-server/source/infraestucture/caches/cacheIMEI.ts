import net from "node:net";
import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";
import { PowerProfileType } from "../../enums/PowerProfileType";

/** Start IMEI Cache */
export var CACHE_IMEI: Cache<{
  lastLBSRequestTimestamp: number;
  socketConn: net.Socket;
  powerProfile: PowerProfileType;
}>;

/** IMEI cahce init */
function initCacheIMEI() {
  printMessage(`✅ IMEI (Devices) cache initialized`);

  CACHE_IMEI = new Cache<{
    lastLBSRequestTimestamp: number;
    socketConn: net.Socket;
    powerProfile: PowerProfileType;
  }>(0); // no expiration
}

/**
 * Clear item in cache
 * @param imei IMEI
 */
function clearItemInCacheIMEI(imei: string) {
  if (imei === "") return;

  CACHE_IMEI.updateOrCreate(imei, {
      socketConn: undefined,
      powerProfile: PowerProfileType.FULL,
    });
}

export { initCacheIMEI, clearItemInCacheIMEI };
