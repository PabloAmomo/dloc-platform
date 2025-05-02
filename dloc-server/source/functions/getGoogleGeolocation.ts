import { CACHE_LBS } from "../infraestucture/caches/cacheLBS";
import { ENABLE_LBS } from "../server";
import { printMessage } from "./printMessage";

async function getGoogleGeolocation(
  lbsQuery: GoogleGeolocationRequest,
  imei: string,
  remoteAdd: string
): Promise<GoogleGeolocationResponse | {}> {

  if (!ENABLE_LBS) {
    printMessage(`[${imei}] (${remoteAdd}) Google Geolocation disabled`);
    return {};
  }
  
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
  if (!apiKey) {
    throw new Error(
      `[${imei}] (${remoteAdd}) Google geolocate API key is not set`
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

  let cacheKey = "";
  if (
    "homeMobileCountryCode" in lbsQuery &&
    "homeMobileNetworkCode" in lbsQuery &&
    "cellTowers" in lbsQuery
  )
    cacheKey = `${lbsQuery.homeMobileCountryCode}-${lbsQuery.homeMobileNetworkCode}-${lbsQuery.cellTowers[0].cellId}-${lbsQuery.cellTowers[0].locationAreaCode}-${lbsQuery.cellTowers[0].mobileCountryCode}-${lbsQuery.cellTowers[0].mobileNetworkCode}`;

  if (cacheKey) {
    const cacheValue = CACHE_LBS.get(cacheKey);

    if (cacheValue) {
      printMessage(
        `[${imei}] (${remoteAdd}) [LBS] Cache hit for ${cacheKey} - ${cacheValue}`
      );
      return cacheValue;
    }
  }
  printMessage(
    `[${imei}] (${remoteAdd}) [LBS] Cache miss for ${cacheKey} using Google Geolocation`
  );

  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lbsQuery),
  });

  const returnValue: GoogleGeolocationResponse = await response.json();

  if (response.status === 200) {
    if (cacheKey) {
      CACHE_LBS.set(cacheKey, returnValue);

      printMessage(
        `[${imei}] (${remoteAdd}) [LBS] Cache set for ${cacheKey} - ${JSON.stringify(
          returnValue
        )}`
      );
    }
  }

  return returnValue;
}

export default getGoogleGeolocation;
