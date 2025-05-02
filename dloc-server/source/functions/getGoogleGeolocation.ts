import { ENABLE_LBS, LBS_CACHE } from "../server";
import { printMessage } from "./printMessage";

async function getGoogleGeolocation(
  lbsQuery: GoogleGeolocationRequest
): Promise<GoogleGeolocationResponse | {}> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

  if (!ENABLE_LBS) {
    printMessage(`Google Geolocation disabled`);
    return {};
  }
  printMessage(
    `[LBS] Google Geolocation API is enabled (Watch the Google Geolocation API quota)`
  );

  if (!apiKey) {
    throw new Error("Google geolocate API key is not set");
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
      printMessage(`[LBS] Cache hit for ${cacheKey} - ${cacheValue}`);
      return JSON.parse(cacheValue);
    }
  }
  printMessage(`[LBS] Cache miss for ${cacheKey} using Google Geolocation`);

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
        `[LBS] Cache set for ${cacheKey} - ${JSON.stringify(returnValue)}`
      );
    }
  }

  return returnValue;
}

export default getGoogleGeolocation;
