import powerProfileConfig from "../../../../functions/powerProfileConfig";
import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { uniqueId } from "../../../../functions/uniqueId";
import jt808CreateTemporaryLocationTrackingPacket from "./jt808CreateTemporaryLocationTrackingPacket";

function jt808CreatePowerProfilePacket(
  terminalId : string,
  counter : number,
  powerProfileType: PowerProfileType
): Buffer {

  const { uploadSec } = powerProfileConfig(
    powerProfileType
  );

  return jt808CreateTemporaryLocationTrackingPacket(
    terminalId,
    counter,
    parseInt(uploadSec),
    300 * 1.5)
}
export default jt808CreatePowerProfilePacket;
