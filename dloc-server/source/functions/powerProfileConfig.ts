import { PowerProfileType } from "../enums/PowerProfileType";
import { printMessage } from "./printMessage";

function powerProfileConfigGFxx(
  profileType: PowerProfileType = PowerProfileType.FULL
) {
  if (
    profileType === PowerProfileType.MINIMAL ||
    profileType === PowerProfileType.AUTOMATIC_MINIMAL
  ) {
    const sec = 180;
    return {
      heartBeatSec: sec.toString(), // seconds
      uploadSec: "120", // seconds
      ledState: "0", // 0: off, 1: on
      forceReportLocInMs: (sec - 10) * 1000, // 0: off, 1000...720000: on [every milliseconds]
    };
  }

  if (
    profileType === PowerProfileType.BALANCED ||
    profileType === PowerProfileType.AUTOMATIC_BALANCED
  ) {
    const sec = 90;
    return {
      heartBeatSec: sec.toString(), // seconds
      uploadSec: "060", // seconds
      ledState: "0", // 0: off, 1: on
      forceReportLocInMs: (sec - 10) * 1000, // 0: off, 1000...720000: on [every milliseconds]
    };
  }

  // Full power profile configuration
  if (
    profileType !== PowerProfileType.FULL &&
    profileType !== PowerProfileType.AUTOMATIC_FULL
  )
    printMessage(
      `❌ power profile [${profileType}] not found, defaulting to full power profile`
    );

  // Full power profile configuration
  const sec = 60;
  return {
    heartBeatSec: sec, // seconds
    uploadSec: "020", // seconds
    ledState: "1", // 0: off, 1: on
    forceReportLocInMs: (sec - 10) * 1000, // 0: off, 1000...720000: on [every milliseconds]
  };
}

export default powerProfileConfigGFxx;
