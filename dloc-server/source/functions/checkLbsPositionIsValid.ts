import config from "../config/config";

const checkLbsPositionIsValid = async (imei: string, lat: number, lng: number, prefix: string): Promise<boolean> => {
  // Check if the LBS position has valid latitude and longitude
  if (!lat || !lng) return false;

  // Check if the latitude and longitude are within valid ranges
  if (lat === config.INVALID_POSITION_LAT_LNG || lng === config.INVALID_POSITION_LAT_LNG ||  lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;

  // TODO: Check Distance from the last known position if available for determining if the LBS position is valid

  // Additional checks can be added here as needed
  return true;
};

export default checkLbsPositionIsValid;
