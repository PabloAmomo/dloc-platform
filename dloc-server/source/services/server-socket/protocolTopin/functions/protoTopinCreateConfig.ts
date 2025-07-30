import { PowerProfileType } from "../../../../enums/PowerProfileType";
import protoTopinCreatePacket0x13 from "./protoTopinCreatePacket0x13";
import protoTopinCreatePacket0x61 from "./protoTopinCreatePacket0x61";
import protoTopinPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

function protoTopinCreateConfig(
  prefix: string,
  powerProfileType: PowerProfileType,
): Buffer[] {
  let response: Buffer[] = [];

  response.push(...protoTopinCreatePacket0x13(prefix, powerProfileType));

  const { ledState } = protoTopinPowerProfileConfig(powerProfileType);
  response.push(protoTopinCreatePacket0x61(ledState));

  return response;
}
export default protoTopinCreateConfig;
