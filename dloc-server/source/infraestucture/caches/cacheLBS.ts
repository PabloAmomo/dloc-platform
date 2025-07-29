import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";
import { CacheLBS } from "../models/CacheLBS";

/** Start LBS Cache */
export var CACHE_LBS: Cache<CacheLBS>;

/** LBS Status */
function initCacheLBS() {
  printMessage(`✅ LBS cache initialized`);

  CACHE_LBS = new Cache<CacheLBS>(3600);
}

export { initCacheLBS };
