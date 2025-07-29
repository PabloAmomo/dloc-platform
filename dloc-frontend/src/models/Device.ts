import DevicePositionEmpty, { DevicePosition } from "./DevicePosition";
import DeviceParamsEmpty, { DeviceParams } from "./DeviceParams";

export type Device = DevicePosition & {
  isShared: boolean,
  params: DeviceParams,
};

export const DeviceEmpty = (): Device => ({
  ...DevicePositionEmpty(),
  isShared: false,
  params: DeviceParamsEmpty(),
});