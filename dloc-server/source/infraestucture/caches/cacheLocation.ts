import { printMessage } from "../../functions/printMessage";
import { PositionPacket } from "../../models/PositionPacket";
import { Cache } from "../../functions/cache";

export var CACHE_LOCATION: Cache<PositionPacket>;

function initCacheLocation() {
  printMessage(`Location cache initialized`);

  CACHE_LOCATION = new Cache<PositionPacket>(3600);
}

export { initCacheLocation };