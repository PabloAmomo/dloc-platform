export interface Position {
  dateTimeUTC: string;
  lat: number;
  lng: number;
  speed: number;
  directionAngle: number;
  gsmSignal: number;
  batteryLevel: number;
}