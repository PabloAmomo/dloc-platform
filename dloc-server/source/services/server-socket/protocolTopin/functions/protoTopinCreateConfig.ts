import { PowerProfileType } from "../../../../enums/PowerProfileType";
import protoTopinCreatePacket from "./protoTopinCreatePacket";
import protoTopinCreateResponse0x97 from "./protoTopinCreatePacket0x97";
import protoTopinPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

function protoTopinCreateConfig(powerProfileType: PowerProfileType): Buffer[] {
  let response: Buffer[] = [];
  const { heartBeatSec, uploadSec, ledState } = protoTopinPowerProfileConfig(powerProfileType);

  response.push(protoTopinCreateResponse0x97(uploadSec)); // Start of packet

  response.push(protoTopinCreatePacket(Buffer.from([0x04, 0x97, 0x00, uploadSec])));
  response.push(protoTopinCreatePacket(Buffer.from([0x05, 0x97, 0x00, uploadSec])));
  response.push(protoTopinCreatePacket(Buffer.from([0x06, 0x97, 0x00, uploadSec])));

  // TODO: Add packet to configure heartbeat interval

  return response;
}
export default protoTopinCreateConfig;
