import { GpsAccuracy } from "enums/GpsAccuracy"

export type LatLng = {
  lat: number,
  lng: number,
  dateTimeUTC?: string,
  bearing: number,
  speed: number,
  locationAccuracy: GpsAccuracy,
  activity: string
}