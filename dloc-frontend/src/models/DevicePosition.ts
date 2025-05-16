import { GpsAccuracy } from "enums/GpsAccuracy";
import { Position } from "./Position";
import { PowerProfileType } from "enums/PowerProfileType";

export type DevicePosition = {
  imei: string,
  batteryLevel: number | null,
  directionAngle: number  | null,
  gsmSignal: number  | null,
  lastPositionUTC: string  | null,
  lastVisibilityUTC: string,
  lat: number | null,
  lng: number | null,
  speed: number,
  positions: Position[],
  isShared: boolean,
  locationAccuracy: GpsAccuracy,
  activity: string,
  powerProfile: PowerProfileType
};

const DevicePositionEmpty = (props?: Partial<DevicePosition>) : DevicePosition => ({
  imei: '',
  batteryLevel: null,
  directionAngle: null,
  gsmSignal: null,
  lastPositionUTC: null,
  lastVisibilityUTC: '',
  lat: null,
  lng: null,
  speed: 0,
  positions: [],
  isShared: false,
  locationAccuracy: GpsAccuracy.unknown,
  activity: '{}',
  powerProfile: PowerProfileType.AUTOMATIC_FULL,
  ...props
});
export default DevicePositionEmpty;


