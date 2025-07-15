import jt808PowerProfileConfig from "../../../../functions/jt808PowerProfileConfig1";
import { PowerProfileType } from "../../../../enums/PowerProfileType";
import jt808CreateTemporaryLocationTrackingPacket from "./jt808CreateTemporaryLocationTrackingPacket";

function jt808CreatePowerProfilePacket(
  terminalId : string,
  counter : number,
  powerProfileType: PowerProfileType,
  durationSec: number 
): Buffer {

  const { uploadSec } = jt808PowerProfileConfig(
    powerProfileType
  );

  return jt808CreateTemporaryLocationTrackingPacket(
    terminalId,
    counter,
    uploadSec,
    durationSec)
}
export default jt808CreatePowerProfilePacket;
