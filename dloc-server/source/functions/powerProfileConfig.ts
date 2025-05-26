import { PowerProfileType } from "../enums/PowerProfileType";
import { printMessage } from "./printMessage";

function powerProfileConfigGFxx(
  profileType: PowerProfileType = PowerProfileType.FULL
) {
  if (
    profileType === PowerProfileType.MINIMAL ||
    profileType === PowerProfileType.AUTOMATIC_MINIMAL
  )
    return {
      heartBeatSec: 120,
      uploadSec: "090",
      ledState: "0",
      forceReportLocInMs: 110000,
    };

  if (
    profileType === PowerProfileType.BALANCED ||
    profileType === PowerProfileType.AUTOMATIC_BALANCED
  )
    return {
      heartBeatSec: 90,
      uploadSec: "060",
      ledState: "0",
      forceReportLocInMs: 80000,
    };

  // Full power profile configuration
  if (
    profileType !== PowerProfileType.FULL &&
    profileType !== PowerProfileType.AUTOMATIC_FULL
  )
    printMessage(
      `❌ power profile [${profileType}] not found, defaulting to full power profile`
    );

  // Full power profile configuration
  return {
    heartBeatSec: 60,
    uploadSec: "020",
    ledState: "1",
    forceReportLocInMs: 50000,
  };
}

export default powerProfileConfigGFxx;
