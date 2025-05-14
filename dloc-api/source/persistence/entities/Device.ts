import { GpsAccuracy } from "../../enums/GpsAccuracy";
import { Position } from "./Position";

export interface Device {
  imei: string;
  lat: number;
  lng: number;
  speed: number;
  directionAngle: number;
  gsmSignal: number;
  batteryLevel: number;
  lastPositionUTC: string;
  lastVisibilityUTC: string; 
  params: string;
  positions?: Position[];
  clonedImei?: string;
  locationAccuracy: GpsAccuracy
  activity: string;
  powerProfile: string;
}