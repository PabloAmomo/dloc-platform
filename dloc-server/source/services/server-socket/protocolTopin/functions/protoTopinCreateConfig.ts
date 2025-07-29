import { PowerProfileType } from "../../../../enums/PowerProfileType";
import protoTopinCreatePacket0x13 from "./protoTopinCreatePacket0x13";
import protoTopinCreatePacket0x33 from "./protoTopinCreatePacket0x33";
import protoTopinCreatePacket0x61 from "./protoTopinCreatePacket0x61";
import protoTopinCreatePacket0x97 from "./protoTopinCreatePacket0x97";
import protoTopinPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

function protoTopinCreateConfig(prefix: string, powerProfileType: PowerProfileType): Buffer[] {
  let response: Buffer[] = [];

  response.push(...protoTopinCreatePacket0x13(prefix, powerProfileType));

  const { ledState, uploadSec } = protoTopinPowerProfileConfig(powerProfileType);

  // TODO: this make a bettery drain
  // response.push(protoTopinCreatePacket0x97(uploadSec)); // Configure upload interval

  response.push(protoTopinCreatePacket0x61(ledState));

  response.push(protoTopinCreatePacket0x33(false)); // Enable LBS positioning

  return response;
}
export default protoTopinCreateConfig;
