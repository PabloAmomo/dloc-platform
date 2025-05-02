import { ENABLE_LBS, LBS_CACHE } from "../server";
import { printMessage } from "./printMessage";

async function getGoogleGeolocation(
  lbsQuery: GoogleGeolocationRequest,
  debugText: string

): Promise<GoogleGeolocationResponse | {}> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

  if (!ENABLE_LBS) {
    printMessage(`${debugText} Google Geolocation disabled`);
    return {};
  }

  if (!apiKey) {
    throw new Error(`${debugText} Google geolocate API key is not set`);
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
  ) {
    cacheKey = `
    ${lbsQuery.homeMobileCountryCode}-
    ${lbsQuery.homeMobileNetworkCode}-
    ${lbsQuery.cellTowers[0].cellId}-
    ${lbsQuery.cellTowers[0].locationAreaCode}-
    ${lbsQuery.cellTowers[0].mobileCountryCode}-
    ${lbsQuery.cellTowers[0].mobileNetworkCode}`;
  }

  if (cacheKey) {
    const cacheValue = LBS_CACHE.get(cacheKey);
    if (cacheValue) {
      printMessage(`${debugText} [LBS] Cache hit for ${cacheKey} - ${cacheValue}`);
      return JSON.parse(cacheValue);
    }
  }
  printMessage(`${debugText} [LBS] Cache miss for ${cacheKey} using Google Geolocation`);

  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lbsQuery),
  });
  const returnValue = await response.json();

  if (response.status === 200) {
    if (cacheKey) {
      LBS_CACHE.set(cacheKey, JSON.stringify(returnValue));
      printMessage(
        `${debugText} [LBS] Cache set for ${cacheKey} - ${JSON.stringify(returnValue)}`
      );
    }
  }

  return returnValue;
}

export default getGoogleGeolocation;
