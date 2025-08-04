import { CellTower } from "./../models/CellTower";
import { CACHE_IMEI } from "../infraestucture/caches/cacheIMEI";
import { CACHE_LBS } from "../infraestucture/caches/cacheLBS";
import { GoogleGeoPositionRequest } from "../models/GoogleGeoPositionRequest";
import { GoogleGeoPositionResponse } from "../models/GoogleGeoPositionResponse";
import { ENABLE_LBS } from "../server";
import googleGeoPositionFetch from "./googleGeoPositionFetch";
import { printMessage } from "./printMessage";
import convertRSSIToPercent from "./convertRSSIToPercent";
import countMatchingMacAddresses from "./countMatchingMacAddresses";

const GOOGLE_LBS_MAX_TIME_DIFF_MINUTES = 1;
const EXTEND_CACHE_LBS_EXPIRATION_WHEN_MORE_AT_LEAST_WIFI_MATCH = 3;

async function getGoogleGeoPosition(
  lbsQuery: GoogleGeoPositionRequest,
  imei: string,
  remoteAddress: string
): Promise<GoogleGeoPositionResponse | {}> {
  /** Check if Google Geoposition is enabled */
  if (!ENABLE_LBS) {
    printMessage(`[${imei}] (${remoteAddress}) 🚫 Google Geoposition disabled`);
    return {};
  }

  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) throw new Error(`Google geolocate API key is not set`);

  // For testing purposes, return a dummy response
  if (apiKey == "your_google_geocoding_api_key") {
    return {
      error: "Google Geoposition API key is not set",
      location: {
        lat: 0,
        lng: 0,
      },
      accuracy: 0,
    };
  }

  /** Generate cache key (With data of the more powerfull tower) */
  let cacheKey = "";
  if ("homeMobileCountryCode" in lbsQuery && "homeMobileNetworkCode" in lbsQuery && "cellTowers" in lbsQuery) {
    let useCellTower: CellTower = lbsQuery.cellTowers[0];

    for (const tower of lbsQuery.cellTowers) {
      if (!tower.signalStrength) continue;

      const useSignal = useCellTower.signalStrength ? convertRSSIToPercent(useCellTower.signalStrength) : 0;
      const newSignal = convertRSSIToPercent(tower.signalStrength);
      if (!useCellTower || newSignal > useSignal) useCellTower = tower;
    }

    cacheKey = `${lbsQuery.homeMobileCountryCode}-${lbsQuery.homeMobileNetworkCode}-${useCellTower.cellId}-${useCellTower.locationAreaCode}-${useCellTower.mobileCountryCode}-${useCellTower.mobileNetworkCode}`;
    cacheKey = cacheKey.replace(/\s+/g, "");

    const cacheValue = CACHE_LBS.get(cacheKey);

    if (cacheValue) {
      /** Check if wifi access points match */
      let wifiApCoincidense = 0;
      if ("wifiAccessPoints" in lbsQuery && cacheValue && "wifiAccessPoints" in cacheValue.request)
        wifiApCoincidense = countMatchingMacAddresses(lbsQuery.wifiAccessPoints, cacheValue.request.wifiAccessPoints);

      /** Only use cache if wifi access points match */
      if (wifiApCoincidense > 0) {
        printMessage(
          `[${imei}] (${remoteAddress}) 🗼 [LBS] ✅ Cache hit ${cacheKey} [Wifi Match: ${wifiApCoincidense}] ${JSON.stringify(
            cacheValue.response.location
          )}`
        );
        // Extend expiration if wifi access points match
        if (wifiApCoincidense > EXTEND_CACHE_LBS_EXPIRATION_WHEN_MORE_AT_LEAST_WIFI_MATCH)
          CACHE_LBS.extendExpiration(cacheKey);
        return cacheValue.response;
      } else
        printMessage(
          `[${imei}] (${remoteAddress}) 🗼 [LBS] ❤️  Cache hit ${cacheKey} ${JSON.stringify(
            cacheValue.response.location
          )} (aps don't match)`
        );
    }
  }

  /** No cache hit, make request */
  printMessage(`[${imei}] (${remoteAddress}) 🗼 [LBS] ❌ Cache miss for ${cacheKey} using Google GeoPosition`);

  const imeiData = CACHE_IMEI.get(imei);
  if (imeiData) {
    /** Check if last request was made less than 5 minutes ago */
    if (
      imeiData.lastLBSRequestTimestamp &&
      Date.now() - imeiData.lastLBSRequestTimestamp < GOOGLE_LBS_MAX_TIME_DIFF_MINUTES * 60 * 1000
    ) {
      printMessage(
        `[${imei}] (${remoteAddress}) 🗼 [LBS] ⚠️  Abort request ! Last request was made less than ${GOOGLE_LBS_MAX_TIME_DIFF_MINUTES} minutes ago`
      );
      return {};
    }
  }

  CACHE_IMEI.updateOrCreate(imei, {
    lastLBSRequestTimestamp: Date.now(),
    lastLBSKey: cacheKey,
  });

  const returnValue = await googleGeoPositionFetch(apiKey, lbsQuery);

  if (returnValue) {
    if (cacheKey) CACHE_LBS.set(cacheKey, { request: lbsQuery, response: returnValue });

    printMessage(
      cacheKey
        ? `[${imei}] (${remoteAddress}) 🗼 [LBS] ✅ Cache set for ${cacheKey} ${JSON.stringify(returnValue)}`
        : `[${imei}] (${remoteAddress}) 🗼 [LBS] ⛔️ No cache key set, not caching response`
    );
  }

  return returnValue ?? {};
}

export default getGoogleGeoPosition;
