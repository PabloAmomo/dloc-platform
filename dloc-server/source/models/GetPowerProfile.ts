import { PowerProfileType } from "../enums/PowerProfileType";
import GetPowerProfileConfig from "./GetProwerProfileConfig";
import { Persistence } from "./Persistence";

export type GetPowerProfile = (
  imei: string,
  persistence: Persistence,
  lastPowerProfileChecked: number,
  messagePrefix: string,
  isNewConnection: boolean,
  currentPowerProfileType: PowerProfileType,
  getPowerProfileConfig: GetPowerProfileConfig
) => Promise<{
  newPowerProfileType: PowerProfileType;
  powerProfileChanged: boolean;
  lastPowerProfileChecked: number;
  needProfileRefresh: boolean;
}>;