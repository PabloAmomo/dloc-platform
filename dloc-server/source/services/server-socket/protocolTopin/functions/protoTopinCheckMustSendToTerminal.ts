import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { printMessage } from "../../../../functions/printMessage";
import protoTopinCreateConfig from "./protoTopinCreateConfig";
import protoTopinGetPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

const protoTopinCheckMustSendToTerminal = (
  imei: string,
  prefix: string,
  powerPrfChanged: boolean,
  needProfileRefresh: boolean,
  currentPowerPrfile: PowerProfileType,
  newPowerProfile: PowerProfileType
): Buffer[] => {
  const { uploadSec, heartBeatSec, forceReportLocInSec, ledState } = protoTopinGetPowerProfileConfig(newPowerProfile);

  if (needProfileRefresh)
    printMessage(`${prefix} 🔄 power profile refresh needed, current profile [${newPowerProfile}]`);

  if (powerPrfChanged)
    printMessage(`${prefix} ⚡️ power profile changed from [${currentPowerPrfile}] to [${newPowerProfile}]`);

  printMessage(
    `${prefix} 📡 set HeartBeat [${heartBeatSec} sec], leds [${ledState}], Upload Interval [${uploadSec} sec], forceUpdateLoc [${forceReportLocInSec} sec]`
  );

  return protoTopinCreateConfig(prefix, newPowerProfile);
};

export default protoTopinCheckMustSendToTerminal;
