import { PowerProfileType } from "../../../../enums/PowerProfileType";
import protoTopinCreatePacket0x61 from "./protoTopinCreatePacket0x61";
import protoTopinCreateResponse0x13 from "./protoTopinCreateResponse0x13";
import protoTopinPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

function protoTopinCreateConfig(powerProfileType: PowerProfileType): Buffer[] {
  let response: Buffer[] = [];
  const { heartBeatSec, uploadSec, ledState } = protoTopinPowerProfileConfig(powerProfileType);

  // TODO: [VERIFY] Not needed for now
  //response.push(protoTopinCreateResponse0x97(uploadSec));
  //response.push(protoTopinCreateResponse0x98(uploadSec));

  let uploadIntervalMin = Math.floor(uploadSec / 60); 
  if (uploadIntervalMin === 0) uploadIntervalMin = 1; // Setting a default value of 1 minute if undefined
  response.push(...protoTopinCreateResponse0x13(uploadIntervalMin, heartBeatSec));

  response.push(protoTopinCreatePacket0x61(ledState));

  return response;
}
export default protoTopinCreateConfig;
