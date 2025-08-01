import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { printMessage } from "../../../../functions/printMessage";
import protoTopinConfig from "../config/protoTopinConfig";
import protoTopinCreatePacket0x97 from "./protoTopinCreatePacket0x97";
import protoTopinCreateResponse0x13 from "./protoTopinCreateResponse0x13";
import protoTopinGetPowerProfileConfig from "../config/protoTopinGetPowerProfileConfig";

const protoTopinCreatePacket0x13 = (prefix: string, powerProfileType: PowerProfileType): Buffer[] => {
  const { heartBeatSec: statusPackageSec, uploadSec } = protoTopinGetPowerProfileConfig(powerProfileType);
  let statusPackageIntervalSec = Math.floor(statusPackageSec / 60);
  if (statusPackageIntervalSec === 0) statusPackageIntervalSec = 1;

  printMessage(`${prefix} ❤️  Send setting status package interval to ${statusPackageIntervalSec} minutes.`);
  printMessage(`${prefix} 🆙 Send setting upload interval to ${uploadSec} seconds.`);

  const packets = protoTopinCreateResponse0x13(statusPackageIntervalSec, uploadSec);

  if (protoTopinConfig.USE_PACKET_0x97) {
    printMessage(`${prefix} 🙋🏻 Send setting upload interval to ${uploadSec} seconds. (With 0x97)`);
    packets.push(protoTopinCreatePacket0x97(uploadSec));
  }

  return packets;
};

export default protoTopinCreatePacket0x13;
