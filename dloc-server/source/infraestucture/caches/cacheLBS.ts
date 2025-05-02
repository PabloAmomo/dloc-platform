import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";
import { GoogleGeolocationRequest } from "../../models/GoogleGeolocationRequest";
import { GoogleGeolocationResponse } from "../../models/GoogleGeolocationResponse";

/** Start LBS Cache */
export var CACHE_LBS: Cache<{
  request: GoogleGeolocationRequest;
  response: GoogleGeolocationResponse;
}>;

/** LBS Status */
function initCacheLBS() {
  printMessage(`LBS cache initialized`);

  CACHE_LBS = new Cache<{
    request: GoogleGeolocationRequest;
    response: GoogleGeolocationResponse;
  }>(3600);
}

export { initCacheLBS };
