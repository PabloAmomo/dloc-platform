import { PowerProfileType } from "../../enums/PowerProfileType";
import { WifiAccessPoint } from "../../models/WifiAccessPoint";

export type CacheImei = {
  lastLBSRequestTimestamp: number;
  powerProfile: PowerProfileType;
  lastPowerProfileChecked: number;
  lastReportRequestTimestamp: number;
};

export const CacheImeiEmptyItem: CacheImei = {
  powerProfile: PowerProfileType.AUTOMATIC_MINIMAL,
  lastPowerProfileChecked: 0,
  lastLBSRequestTimestamp: 0,
  lastReportRequestTimestamp: 0,
};
