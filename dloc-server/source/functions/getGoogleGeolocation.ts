import { printMessage } from "./printMessage";

async function getGoogleGeolocation(
  lbsQuery: GoogleGeolocationRequest
): Promise<GoogleGeolocationResponse> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

  if (process.env.ENABLE_LBS !== "true") {
    printMessage(`Google Geolocation disabled`);
    return {} as GoogleGeolocationResponse;
  }

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

  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lbsQuery),
  });
  return await response.json();
}

export default getGoogleGeolocation;
