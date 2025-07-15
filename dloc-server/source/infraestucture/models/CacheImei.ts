import net from "node:net";
import { PowerProfileType } from "../../enums/PowerProfileType";

export type CacheImei = {
  lastLBSRequestTimestamp: number;
  socketConn: net.Socket;
  powerProfile: PowerProfileType;
  lastPowerProfileChecked: number;
  lastReportRequestTimestamp: number;
}