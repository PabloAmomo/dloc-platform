import { printMessage } from "../../functions/printMessage";
import { PositionPacket } from "../../models/PositionPacket";
import { Cache } from "../../functions/cache";

export var CACHE_POSITION: Cache<PositionPacket>;

function initCachePosition() {
  printMessage(`Position cache initialized`);

  CACHE_POSITION = new Cache<PositionPacket>(3600);
}

export { initCachePosition  };