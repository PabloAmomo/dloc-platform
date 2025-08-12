import { Persistence } from "./../models/Persistence";
import config from "../config/config";
import { CACHE_POSITION } from "../infraestucture/caches/cachePosition";
import { printMessage } from "./printMessage";

const checkLbsPositionIsValid = async (
  imei: string,
  lat: number,
  lng: number,
  persistence: Persistence,
  prefix: string
): Promise<boolean> => {
  // Check if the LBS position has valid latitude and longitude
  if (!lat || !lng) return false;

  // Check if the latitude and longitude are within valid ranges
  if (
    lat === config.INVALID_POSITION_LAT_LNG ||
    lng === config.INVALID_POSITION_LAT_LNG ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  )
    return false;

  // VERIFY: Check Distance from the last known position if available for determining if the LBS position is valid
  let lastPosition = CACHE_POSITION.get(imei);
  if (!lastPosition) {
    const response = await persistence.getLastPosition(imei);
    if (response.error) {
      printMessage(`${prefix} ❌ Error getting last position for ${imei}: ${response.error}`);
      return true;
    }
    
    if (response.results && response.results.length > 0) {
      lastPosition = {
        imei,
        dateTimeUtc: new Date(response.results[0].lastVisibilityUTC),
        lat: response.results[0].lat,
        lng: response.results[0].lng,
        valid: true,
        remoteAddress: "",
        speed: 0,
        directionAngle: 0,
        gsmSignal: 0,
        batteryLevel: 0,
        accuracy: response.results[0].locationAccuracy,
        activity: "{}",
      };
      CACHE_POSITION.set(imei, lastPosition);
    }
  }

  if (!lastPosition || !lastPosition?.lat || !lastPosition.lng || !lastPosition.dateTimeUtc) return true;

  // Calculate the distance from the last known position
  const distance = Math.sqrt(Math.pow(lat - lastPosition.lat, 2) + Math.pow(lng - lastPosition.lng, 2));
  const speedInKmH = (distance / (Date.now() - lastPosition.dateTimeUtc.getTime())) * (1000 * 60 * 60); // Convert to km/h

  if (speedInKmH > config.MAX_SPEED_KMH_ON_LBS_MOVEMENET) {
    printMessage(
      `${prefix} ❌ Invalid LBS position change. ⏱️  Speed ${speedInKmH} km/h exceeds maximum allowed speed of ${config.MAX_SPEED_KMH_ON_LBS_MOVEMENET} km/h`
    );
    return false; // Position is too far from the last known position
  }

  // If all checks pass, the position is valid
  return true;
};

export default checkLbsPositionIsValid;
