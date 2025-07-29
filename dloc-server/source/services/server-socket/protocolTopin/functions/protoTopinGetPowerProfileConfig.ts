import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { PowerProfileConfig } from "../../../../models/PowerProfileConfig";
import { printMessage } from "../../../../functions/printMessage";
import GetPowerProfileConfig from "../../../../models/GetProwerProfileConfig";

const protoTopinGetPowerProfileConfig: GetPowerProfileConfig = (
  profileType: PowerProfileType = PowerProfileType.FULL
): PowerProfileConfig => {
  if (profileType === PowerProfileType.MINIMAL || profileType === PowerProfileType.AUTOMATIC_MINIMAL)
    return {
      heartBeatSec: 120,
      uploadSec: 90,
      ledState: false,
      forceReportLocInSec: 110,
      movementMeters: 25,
    };

  if (profileType === PowerProfileType.BALANCED || profileType === PowerProfileType.AUTOMATIC_BALANCED)
    return {
      heartBeatSec: 120,
      uploadSec: 60,
      ledState: false,
      forceReportLocInSec: 80,
      movementMeters: 50,
    };

  // Full power profile configuration
  if (profileType !== PowerProfileType.FULL && profileType !== PowerProfileType.AUTOMATIC_FULL)
    printMessage(`❌ power profile (ProtoTopin) [${profileType}] not found, defaulting to full power profile`);

  // Full power profile configuration
  return {
    heartBeatSec: 120,
    uploadSec: 20,
    ledState: false,
    forceReportLocInSec: 50,
    movementMeters: 50,
  };
};

export default protoTopinGetPowerProfileConfig;
