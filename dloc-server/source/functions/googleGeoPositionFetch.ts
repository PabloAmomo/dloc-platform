import { GoogleGeoPositionRequest } from "../models/GoogleGeoPositionRequest";
import { GoogleGeoPositionResponse } from "../models/GoogleGeoPositionResponse";

const googleGeoPositionFetch = async (
  apiKey: string,
  googleGeoPositionRequest: GoogleGeoPositionRequest
): Promise<GoogleGeoPositionResponse | null> => {
  const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(googleGeoPositionRequest),
  });

  if (!response.ok || response.status !== 200) return null;

  return await response.json();
};

export default googleGeoPositionFetch;
