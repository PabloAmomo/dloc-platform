async function getGoogleGeolocation(lbsQuery: GoogleGeolocationRequest): Promise<any> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

  if (!apiKey) {
    throw new Error("Google geolocate API key is not set");
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
