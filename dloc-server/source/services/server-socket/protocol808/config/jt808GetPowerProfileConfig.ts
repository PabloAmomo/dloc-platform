import { PowerProfileType, powerProfileTypeIsBalanced, powerProfileTypeIsFull, powerProfileTypeIsMinimal } from "../../../../enums/PowerProfileType";
import { PowerProfileConfig } from "../../../../models/PowerProfileConfig";
import { printMessage } from "../../../../functions/printMessage";
import GetPowerProfileConfig from "../../../../models/GetProwerProfileConfig";

const jt808GetPowerProfileConfig: GetPowerProfileConfig = (
  profileType: PowerProfileType = PowerProfileType.FULL
): PowerProfileConfig => {
  if (powerProfileTypeIsMinimal(profileType))
    return {
      heartBeatSec: 150,
      uploadSec: 120,
      ledState: false,
      forceReportLocInSec: 125,
      movementMeters: 50,
    };

  else if (powerProfileTypeIsBalanced(profileType))
    return {
      heartBeatSec: 90,
      uploadSec: 60,
      ledState: false,
      forceReportLocInSec: 65,
      movementMeters: 50,
    };

  else if (!powerProfileTypeIsFull(profileType))
    printMessage(`❌ power profile (ProtoTopin) [${profileType}] not found, defaulting to full power profile`);

  /** Full power profile configuration */
  return {
    heartBeatSec: 60,
    uploadSec: 20,
    ledState: true,
    forceReportLocInSec: 45,
    movementMeters: 50,
  };
};

export default jt808GetPowerProfileConfig;
