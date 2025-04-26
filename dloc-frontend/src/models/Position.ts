import { GpsAccuracy } from "enums/GpsAccuracy";

export type Position = {
  batteryLevel: number,
  dateTimeUTC: string,
  directionAngle: number,
  gsmSignal: number,
  lat: number,
  lng: number,
  speed: number,
  locationAccuracy: GpsAccuracy
  activity: string
};