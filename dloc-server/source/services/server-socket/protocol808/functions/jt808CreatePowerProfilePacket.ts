import powerProfileConfig from "../../../../functions/powerProfileConfig";
import { PowerProfileType } from "../../../../enums/PowerProfileType";
import jt808CreateTemporaryLocationTrackingPacket from "./jt808CreateTemporaryLocationTrackingPacket";

function jt808CreatePowerProfilePacket(
  terminalId : string,
  counter : number,
  powerProfileType: PowerProfileType,
  durationSec: number 
): Buffer {

  const { uploadSec } = powerProfileConfig(
    powerProfileType
  );

  return jt808CreateTemporaryLocationTrackingPacket(
    terminalId,
    counter,
    uploadSec,
    durationSec)
}
export default jt808CreatePowerProfilePacket;
