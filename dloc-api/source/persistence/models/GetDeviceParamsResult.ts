import { DeviceParams } from "../entities/DeviceParams";

export interface GetDeviceParamsResult {
  results: DeviceParams | undefined;
  error?: Error;  
}