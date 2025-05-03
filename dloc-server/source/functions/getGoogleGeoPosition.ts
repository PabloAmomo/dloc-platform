import { CACHE_LBS } from "../infraestucture/caches/cacheLBS";
import { GoogleGeoPositionRequest } from "../models/GoogleGeoPositionRequest";
import { GoogleGeoPositionResponse } from "../models/GoogleGeoPositionResponse";
import { WifiAccessPoint } from "../models/WifiAccessPoint";
import { ENABLE_LBS } from "../server";
import { printMessage } from "./printMessage";

async function getGoogleGeoPosition(
  lbsQuery: GoogleGeoPositionRequest,
  imei: string,
  remoteAddress: string
): Promise<GoogleGeoPositionResponse | {}> {
  if (!ENABLE_LBS) {
    printMessage(`[${imei}] (${remoteAddress}) Google Geoposition disabled`);
    return {};
  }

  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) {
    throw new Error(
      `[${imei}] (${remoteAddress}) Google geolocate API key is not set`
    );
  }

  // For testing purposes, return a dummy response
  if (apiKey == "your_google_geocoding_api_key") {
    return {
      location: {
        lat: 0,
        lng: 0,
      },
      accuracy: 0,
    };
  }

  /** Generate cache key */
  let cacheKey = "";
  if (
    "homeMobileCountryCode" in lbsQuery &&
    "homeMobileNetworkCode" in lbsQuery &&
    "cellTowers" in lbsQuery
  )
    cacheKey = `${lbsQuery.homeMobileCountryCode}-${lbsQuery.homeMobileNetworkCode}-${lbsQuery.cellTowers[0].cellId}-${lbsQuery.cellTowers[0].locationAreaCode}-${lbsQuery.cellTowers[0].mobileCountryCode}-${lbsQuery.cellTowers[0].mobileNetworkCode}`;

  if (cacheKey) {
    const cacheValue = CACHE_LBS.get(cacheKey);

    /** Check if wifi access points match */
    let wifiApCoincidense = 0;
    if (
      "wifiAccessPoints" in lbsQuery &&
      cacheValue &&
      "wifiAccessPoints" in cacheValue.request
    )
      wifiApCoincidense = countMatchingMacAddresses(
        lbsQuery.wifiAccessPoints,
        cacheValue.request.wifiAccessPoints
      );

    if (cacheValue) {
      /** Only use cache if wifi access points match */
      if (wifiApCoincidense > 0) {
        printMessage(
          `[${imei}] (${remoteAddress}) [LBS] Cache hit for ${cacheKey} - [Wifi Match: ${wifiApCoincidense}] ${cacheValue.response}`
        );
        return cacheValue;
      } else
        printMessage(
          `[${imei}] (${remoteAddress}) [LBS] Cache hit for ${cacheKey} - ${cacheValue.response} but wifi access points do not match (${wifiApCoincidense} matches)`
        );
    }
  }

  /** No cache hit, make request */
  printMessage(
    `[${imei}] (${remoteAddress}) [LBS] Cache miss for ${cacheKey} using Google GeoPosition`
  );

  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lbsQuery),
  });

  const returnValue: GoogleGeoPositionResponse = await response.json();

  if (response.status === 200) {
    if (cacheKey) {
      /** Set cache */
      CACHE_LBS.set(cacheKey, { request: lbsQuery, response: returnValue });

      printMessage(
        `[${imei}] (${remoteAddress}) [LBS] Cache set for ${cacheKey} ${JSON.stringify(
          returnValue
        )}`
      );
    }
  }

  return returnValue;
}

export default getGoogleGeoPosition;

function countMatchingMacAddresses(
  arr1: WifiAccessPoint[],
  arr2: WifiAccessPoint[]
): number {
  const macSet1 = new Set(
    arr1.map((device) => device.macAddress.toLowerCase())
  );
  let count = 0;

  for (const device of arr2) {
    if (macSet1.has(device.macAddress.toLowerCase())) {
      count++;
    }
  }

  return count;
}
