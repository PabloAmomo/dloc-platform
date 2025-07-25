import { PowerProfileType } from '../../../../enums/PowerProfileType';
import { printMessage } from '../../../../functions/printMessage';
import protoGt06CreateConfig from './protoGt06CreateConfig';
import protoGt06GetPowerProfileConfig from './protoGt06GetPowerProfileConfig';

const protoGt06CheckMustSendToTerminal = (
  imei: string,
  prefix: string,
  powerPrfChanged: boolean,
  needProfileRefresh: boolean,
  currentPowerPrfile: PowerProfileType,
  newPowerProfile: PowerProfileType
): string => {
  const { uploadSec, heartBeatSec, forceReportLocInSec, ledState } = protoGt06GetPowerProfileConfig(newPowerProfile);

  if (needProfileRefresh) {
    printMessage(
      `${prefix} 🔄 power profile refresh needed, current profile [${newPowerProfile}]`
    );
  }

  if (powerPrfChanged)
    printMessage(
      `${prefix} ⚡️ power profile changed from [${currentPowerPrfile}] to [${newPowerProfile}]`
    );

  printMessage(
    `${prefix} 📡 send HeartBeat [${heartBeatSec} sec] - Leds [${ledState}] - Upload Interval [${uploadSec} sec] - forceUpdateLoc [${
      forceReportLocInSec
    } sec]`
  );

  return protoGt06CreateConfig(newPowerProfile);
};

export default protoGt06CheckMustSendToTerminal;
