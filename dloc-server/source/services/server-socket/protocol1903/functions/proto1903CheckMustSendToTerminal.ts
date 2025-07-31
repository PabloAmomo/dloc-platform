import { PowerProfileType } from '../../../../enums/PowerProfileType';
import { printMessage } from '../../../../functions/printMessage';
import proto1903PowerProfileConfig from '../config/proto1903GetPowerProfileConfig';
import proto1903CreateConfig from './proto1903CreateConfig';

const proto1903CheckMustSendToTerminal = (
  imei: string,
  prefix: string,
  powerPrfChanged: boolean,
  needProfileRefresh: boolean,
  currentPowerPrfile: PowerProfileType,
  newPowerProfile: PowerProfileType
): string => {
  const { uploadSec, heartBeatSec, forceReportLocInSec, ledState } = proto1903PowerProfileConfig(newPowerProfile);

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

  return proto1903CreateConfig(newPowerProfile);
};

export default proto1903CheckMustSendToTerminal;
