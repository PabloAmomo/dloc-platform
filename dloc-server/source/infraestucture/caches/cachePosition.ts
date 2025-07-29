import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";
import { CachePosition } from "../models/CachePosition";

export var CACHE_POSITION: Cache<CachePosition>;

function initCachePosition() {
  printMessage(`✅ Position cache initialized`);

  CACHE_POSITION = new Cache<CachePosition>(3600);
}

export { initCachePosition  };