import { Device } from "./Device";

export interface DevicesProviderInterface {
  devices?: Device[];
  lastUpdate: undefined | Date,
  setDevices: { (devices: Device[]): void; };
  setLastUpdate: { () : void; },
}