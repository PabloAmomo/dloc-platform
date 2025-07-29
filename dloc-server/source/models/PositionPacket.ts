import { GpsAccuracy } from "./GpsAccuracy";

export interface PositionPacket {
  imei: string;
  remoteAddress: string;
  dateTimeUtc: Date | null;
  valid: boolean;
  lat: number | null;
  lng: number | null;
  speed: number;
  directionAngle: number;
  gsmSignal: number;
  batteryLevel: number;
  accuracy: GpsAccuracy;
  activity: string;
}
