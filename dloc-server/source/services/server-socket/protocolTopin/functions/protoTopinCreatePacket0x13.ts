import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { printMessage } from "../../../../functions/printMessage";
import protoTopinCreatePacket0x97 from "./protoTopinCreatePacket0x97";
import protoTopinCreateResponse0x13 from "./protoTopinCreateResponse0x13";
import protoTopinGetPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

const protoTopinCreatePacket0x13 = (prefix: string, powerProfileType: PowerProfileType): Buffer[] => {
  const { heartBeatSec, uploadSec } = protoTopinGetPowerProfileConfig(powerProfileType);
  let heartBeatIntervalMin = Math.floor(heartBeatSec / 60);
  if (heartBeatIntervalMin === 0) heartBeatIntervalMin = 1;

  printMessage(`${prefix} ❤️  Send setting hearbeat interval to ${heartBeatIntervalMin} minutes.`);
  printMessage(`${prefix} 🆙 Send setting upload interval to ${uploadSec} seconds.`);

  const packets = protoTopinCreateResponse0x13(heartBeatIntervalMin, uploadSec);
  
  packets.push(protoTopinCreatePacket0x97(uploadSec));

  return packets;
};

export default protoTopinCreatePacket0x13;
