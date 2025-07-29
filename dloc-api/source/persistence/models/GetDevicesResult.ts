import { Device } from "../entities/Device";
import { DeviceUser } from "../entities/DeviceUser";

export interface GetDevicesResult {
  results: (DeviceUser | Device)[];
  error?: Error;  
}