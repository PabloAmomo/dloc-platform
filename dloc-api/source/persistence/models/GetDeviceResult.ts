import { Device } from "../entities/Device";
import { DeviceUser } from "../entities/DeviceUser";

export interface GetDeviceResult {
  results: (DeviceUser | Device)[];
  error?: Error;  
}