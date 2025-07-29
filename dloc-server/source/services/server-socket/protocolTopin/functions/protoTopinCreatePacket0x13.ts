import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { printMessage } from "../../../../functions/printMessage";
import protoTopinCreateResponse0x13 from "./protoTopinCreateResponse0x13";
import protoTopinGetPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

const protoTopinCreatePacket0x13 = (prefix: string, powerProfileType: PowerProfileType) : Buffer[] => {
  const { heartBeatSec, uploadSec } = protoTopinGetPowerProfileConfig(powerProfileType);
  let heartBeatIntervalMin = Math.floor(heartBeatSec / 60);
  if (heartBeatIntervalMin === 0) heartBeatIntervalMin = 1;

  printMessage(`${prefix} 🆙 Request hearbeat interval to ${heartBeatIntervalMin} minutes.`);
  printMessage(`${prefix} ❤️  Request upload interval to ${uploadSec} seconds.`);

  return protoTopinCreateResponse0x13(5, 20);
}

export default protoTopinCreatePacket0x13;