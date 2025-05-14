import { PowerProfileType } from "./powerProfileType";
import { printMessage } from "./printMessage";

function powerProfileConfigGFxx(profileType: PowerProfileType = PowerProfileType.FULL) {

  if (profileType === PowerProfileType.MINIMAL) {
    return {
      heartBeatSec: "240",            // seconds
      uploadSec: "0180",              // seconds
      ledState: "0",                  // 0: off, 1: on
      forceReportLocInMs: 240 * 1000, // 0: off, 1000...720000: on [every milliseconds]
    };
  }

  if (profileType === PowerProfileType.BALANCED) {
    return {
      heartBeatSec: "180",            // seconds
      uploadSec: "060",               // seconds
      ledState: "0",                  // 0: off, 1: on
      forceReportLocInMs: 90 * 1000,  // 0: off, 1000...720000: on [every milliseconds]
    };
  }

  // Full power profile configuration
  if (profileType !== PowerProfileType.FULL) 
    printMessage(
      `❌ power profile [${profileType}] not found, defaulting to full power profile`
    );

    return {
      heartBeatSec: "120",              // seconds
      uploadSec: "0020",                // seconds
      ledState: "1",                    // 0: off, 1: on
      forceReportLocInMs: 60 * 1000,    // 0: off, 1000...720000: on [every milliseconds]
    };
  

  // Default to full power profile if no valid type is provided
}

export default powerProfileConfigGFxx;
