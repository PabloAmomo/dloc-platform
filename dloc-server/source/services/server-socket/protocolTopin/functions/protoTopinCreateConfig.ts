import { PowerProfileType } from "../../../../enums/PowerProfileType";
import protoTopinCreatePacket0x13 from "./protoTopinCreatePacket0x13";
import protoTopinCreatePacket0x33 from "./protoTopinCreatePacket0x33";
import protoTopinCreatePacket0x44 from "./protoTopinCreatePacket0x44";
import protoTopinCreatePacket0x61 from "./protoTopinCreatePacket0x61";
import protoTopinPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

function protoTopinCreateConfig(
  prefix: string,
  powerProfileType: PowerProfileType,
  isNewConnection: boolean
): Buffer[] {
  let response: Buffer[] = [];

  response.push(...protoTopinCreatePacket0x13(prefix, powerProfileType));

  // TODO: this make a bettery drain
  // const { uploadSec } = protoTopinPowerProfileConfig(powerProfileType);
  // response.push(protoTopinCreatePacket0x97(uploadSec)); // Configure upload interval

  const { ledState } = protoTopinPowerProfileConfig(powerProfileType);
  response.push(protoTopinCreatePacket0x61(ledState));

  if (isNewConnection) response.push(protoTopinCreatePacket0x33(false)); // Enable LBS positioning

  return response;
}
export default protoTopinCreateConfig;
