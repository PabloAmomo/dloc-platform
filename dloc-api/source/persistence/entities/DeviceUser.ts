import { Device } from "./Device";

export interface DeviceUser extends Omit<Device, 'clonedImei'> {
  isShared: boolean;
}