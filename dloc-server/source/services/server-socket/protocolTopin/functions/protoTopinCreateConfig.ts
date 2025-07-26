import { PowerProfileType } from "../../../../enums/PowerProfileType";
import protoTopinCreateResponse0x97 from "./protoTopinCreatePacket0x97";
import protoTopinCreateResponse0x98 from "./protoTopinCreatePacket0x98";
import protoTopinCreateResponse0x13 from "./protoTopinCreateResponse0x13";
import protoTopinPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

function protoTopinCreateConfig(powerProfileType: PowerProfileType): Buffer[] {
  let response: Buffer[] = [];
  const { heartBeatSec, uploadSec, ledState } = protoTopinPowerProfileConfig(powerProfileType);

  response.push(protoTopinCreateResponse0x97(uploadSec));
  response.push(protoTopinCreateResponse0x98(uploadSec));

  let uploadIntervalMin = Math.floor(uploadSec / 60); 
  if (uploadIntervalMin === 0) uploadIntervalMin = 1; // Setting a default value of 1 minute if undefined
  response.push(...protoTopinCreateResponse0x13(uploadIntervalMin, heartBeatSec));

  return response;
}
export default protoTopinCreateConfig;
