import { printMessage } from "../../functions/printMessage";
import { Cache } from "../../functions/cache";

/** Start LBS Cache */
export var CACHE_LBS: Cache<GoogleGeolocationResponse>; // 1 hour in seconds

/** LBS Status */
function initCacheLBS() {
  printMessage(
    `Google Geolocation: ${
      process.env.ENABLE_LBS === "true"
        ? "enabled (Watch the Google Geolocation API quota)"
        : "disabled"
    }`
  );

  CACHE_LBS = new Cache<GoogleGeolocationResponse>(3600);
}

export { initCacheLBS };