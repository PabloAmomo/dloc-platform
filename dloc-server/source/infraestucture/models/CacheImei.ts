import { PowerProfileType } from "../../enums/PowerProfileType";

export type CacheImei = {
  powerProfile: PowerProfileType;
  lastPowerProfileChecked: number;
  lastLBSRequestTimestamp: number;
  lastLBSKey: string;
  lastReportRequestTimestamp: number;
};

export const CacheImeiEmptyItem: CacheImei = {
  powerProfile: PowerProfileType.AUTOMATIC_MINIMAL,
  lastPowerProfileChecked: 0,
  lastLBSRequestTimestamp: 0,
  lastLBSKey: "",
  lastReportRequestTimestamp: 0,
};
