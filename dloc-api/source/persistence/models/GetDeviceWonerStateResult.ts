import { DeviceOwnerStates } from "../../enums/DeviceOwnerStates";

export interface GetDeviceOwnerStateResult {
  state: DeviceOwnerStates;
  userAssigned: string;
  verificationCode: string;
  isCloned: boolean;
  clonedImei: string;
}