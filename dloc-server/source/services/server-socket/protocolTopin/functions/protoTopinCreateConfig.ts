import { PowerProfileType } from "../../../../enums/PowerProfileType";
import protoTopinCreateResponse0x97 from "./protoTopinCreatePacket0x97";
import protoTopinPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

function protoTopinCreateConfig(powerProfileType: PowerProfileType): Buffer[] {
  let response: Buffer[] = [];
  const { heartBeatSec, uploadSec, ledState } = protoTopinPowerProfileConfig(powerProfileType);

  response.push(protoTopinCreateResponse0x97(uploadSec)); // Start of packet

  // TODO: Add packet to configure heartbeat interval

  return response;
}
export default protoTopinCreateConfig;
