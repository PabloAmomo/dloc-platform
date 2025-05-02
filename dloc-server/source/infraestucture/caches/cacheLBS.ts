import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";
import { GoogleGeoPositionRequest } from "../../models/GoogleGeoPositionRequest";
import { GoogleGeoPositionResponse } from "../../models/GoogleGeoPositionResponse";

/** Start LBS Cache */
export var CACHE_LBS: Cache<{
  request: GoogleGeoPositionRequest;
  response: GoogleGeoPositionResponse;
}>;

/** LBS Status */
function initCacheLBS() {
  printMessage(`LBS cache initialized`);

  CACHE_LBS = new Cache<{
    request: GoogleGeoPositionRequest;
    response: GoogleGeoPositionResponse;
  }>(3600);
}

export { initCacheLBS };
