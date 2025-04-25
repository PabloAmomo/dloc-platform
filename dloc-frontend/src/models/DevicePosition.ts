import { Position } from "./Position";

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
  ...props
});
export default DevicePositionEmpty;


