import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { printMessage } from "../../../../functions/printMessage";
import protoTopinCreatePacket0x13 from "./protoTopinCreatePacket0x13";
import protoTopinCreatePacket0x61 from "./protoTopinCreatePacket0x61";
import protoTopinGetPowerProfileConfig from "../config/protoTopinGetPowerProfileConfig";

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

  let response: Buffer[] = [];
  response.push(...protoTopinCreatePacket0x13(prefix, newPowerProfile));
  response.push(protoTopinCreatePacket0x61(ledState));

  return response;
};

export default protoTopinCheckMustSendToTerminal;
