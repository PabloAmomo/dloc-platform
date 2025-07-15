import { PowerProfileType } from "../enums/PowerProfileType";
import { PowerProfileConfig } from "../models/PowerProfileConfig";
import { printMessage } from "./printMessage";

// TODO: [REFACTOR] Create powerProfileConfig.ts for each protocol (808 and 1903) to allow different configurations
function jt808PowerProfileConfig(
  profileType: PowerProfileType = PowerProfileType.FULL
) : PowerProfileConfig {
  if (
    profileType === PowerProfileType.MINIMAL ||
    profileType === PowerProfileType.AUTOMATIC_MINIMAL
  )
    return {
      heartBeatSec: 60,
      uploadSec: 90,
      ledState: false,
      forceReportLocInMs: 110000,
    };

  if (
    profileType === PowerProfileType.BALANCED ||
    profileType === PowerProfileType.AUTOMATIC_BALANCED
  )
    return {
      heartBeatSec: 60,
      uploadSec: 60,
      ledState: false,
      forceReportLocInMs: 80000,
    };

  // Full power profile configuration
  if (
    profileType !== PowerProfileType.FULL &&
    profileType !== PowerProfileType.AUTOMATIC_FULL
  )
    printMessage(
      `❌ power profile (Proto JT808) [${profileType}] not found, defaulting to full power profile`
    );

  // Full power profile configuration
  return {
    heartBeatSec: 60,
    uploadSec: 20,
    ledState: true,
    forceReportLocInMs: 50000,
  };
}

export default jt808PowerProfileConfig;
