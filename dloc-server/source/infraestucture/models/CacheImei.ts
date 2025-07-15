import net from "node:net";
import { PowerProfileType } from "../../enums/PowerProfileType";

export type CacheImei = {
  lastLBSRequestTimestamp: number;
  powerProfile: PowerProfileType;
  lastPowerProfileChecked: number;
  lastReportRequestTimestamp: number;
}