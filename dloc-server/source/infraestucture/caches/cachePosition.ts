import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";
import { PositionPacketWithDatetime } from "../../models/PositionPacketWithDatetime";

export var CACHE_POSITION: Cache<PositionPacketWithDatetime>;



function initCachePosition() {
  printMessage(`Position cache initialized`);

  CACHE_POSITION = new Cache<PositionPacketWithDatetime>(3600);
}

export { initCachePosition  };