import {
    PowerProfileType, powerProfileTypeIsBalanced, powerProfileTypeIsFull, powerProfileTypeIsMinimal
} from '../../../../enums/PowerProfileType';
import { printMessage } from '../../../../functions/printMessage';
import GetPowerProfileConfig from '../../../../models/GetProwerProfileConfig';
import { PowerProfileConfig } from '../../../../models/PowerProfileConfig';

const proto1903GetPowerProfileConfig: GetPowerProfileConfig = (
  profileType: PowerProfileType = PowerProfileType.FULL
): PowerProfileConfig => {
  if (powerProfileTypeIsMinimal(profileType))
    return {
      heartBeatSec: 120,
      uploadSec: 90,
      ledState: false,
      forceReportLocInSec: 110,
      movementMeters: 25,
    };
  else if (powerProfileTypeIsBalanced(profileType))
    return {
      heartBeatSec: 120,
      uploadSec: 60,
      ledState: false,
      forceReportLocInSec: 80,
      movementMeters: 50,
    };
  else if (!powerProfileTypeIsFull(profileType))
    printMessage(`❌ power profile (ProtoTopin) [${profileType}] not found, defaulting to full power profile`);

  /** Full power profile configuration */
  return {
    heartBeatSec: 120,
    uploadSec: 20,
    ledState: true,
    forceReportLocInSec: 50,
    movementMeters: 50,
  };
};

export default proto1903GetPowerProfileConfig;
