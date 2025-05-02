import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";
import { GoogleGeolocationRequest } from "../../models/GoogleGeolocationRequest";
import { GoogleGeolocationResponse } from "../../models/GoogleGeolocationResponse";

/** Start LBS Cache */
export var CACHE_LBS: Cache<{
  request: GoogleGeolocationRequest;
  response: GoogleGeolocationResponse;
}>; // 1 hour in seconds

/** LBS Status */
function initCacheLBS() {
  printMessage(
    `Google Geolocation: ${
      process.env.ENABLE_LBS === "true"
        ? "enabled (Watch the Google Geolocation API quota)"
        : "disabled"
    }`
  );

  CACHE_LBS = new Cache<{
    request: GoogleGeolocationRequest;
    response: GoogleGeolocationResponse;
  }>(3600);
}

export { initCacheLBS };
