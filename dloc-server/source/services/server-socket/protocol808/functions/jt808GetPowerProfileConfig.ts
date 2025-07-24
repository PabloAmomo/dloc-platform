import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { PowerProfileConfig } from "../../../../models/PowerProfileConfig";
import { printMessage } from "../../../../functions/printMessage";
import GetPowerProfileConfig from "../../../../models/GetProwerProfileConfig";

const jt808GetPowerProfileConfig: GetPowerProfileConfig = (
  profileType: PowerProfileType = PowerProfileType.FULL
): PowerProfileConfig => {
  if (profileType === PowerProfileType.MINIMAL || profileType === PowerProfileType.AUTOMATIC_MINIMAL)
    return {
      heartBeatSec: 150,
      uploadSec: 120,
      ledState: false,
      forceReportLocInSec: 125,
      movementMeters: 50,
    };

  if (profileType === PowerProfileType.BALANCED || profileType === PowerProfileType.AUTOMATIC_BALANCED)
    return {
      heartBeatSec: 90,
      uploadSec: 60,
      ledState: false,
      forceReportLocInSec: 65,
      movementMeters: 50,
    };

  // Full power profile configuration
  if (profileType !== PowerProfileType.FULL && profileType !== PowerProfileType.AUTOMATIC_FULL)
    printMessage(`❌ power profile (Proto JT808) [${profileType}] not found, defaulting to full power profile`);

  // Full power profile configuration
  return {
    heartBeatSec: 60,
    uploadSec: 20,
    ledState: true,
    forceReportLocInSec: 45,
    movementMeters: 50,
  };
};

export default jt808GetPowerProfileConfig;
