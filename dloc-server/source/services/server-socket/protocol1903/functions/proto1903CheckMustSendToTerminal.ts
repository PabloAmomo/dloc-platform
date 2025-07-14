import { PowerProfileType } from '../../../../enums/PowerProfileType';
import powerProfileConfig from '../../../../functions/powerProfileConfig';
import { printMessage } from '../../../../functions/printMessage';
import proto1903CreateConfig from './proto1903CreateConfig';

const proto1903CheckMustSendToTerminal = (
  imei: string,
  prefix: string,
  powerPrfChanged: boolean,
  needProfileRefresh: boolean,
  currentPowerPrfile: PowerProfileType,
  newPowerProfile: PowerProfileType
): string => {
  const { uploadSec, heartBeatSec, forceReportLocInMs, ledState } = powerProfileConfig(newPowerProfile);

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
      forceReportLocInMs / 1000
    } sec]`
  );

  return proto1903CreateConfig(newPowerProfile);
};

export default proto1903CheckMustSendToTerminal;
