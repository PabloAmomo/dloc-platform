import powerProfileConfig from "../../../../functions/powerProfileConfig";
import { PowerProfileType } from "../../../../enums/PowerProfileType";
import jt808CreateTemporaryLocationTrackingPacket from "./jt808CreateTemporaryLocationTrackingPacket";

function jt808CreatePowerProfilePacket(
  terminalId : string,
  counter : number,
  powerProfileType: PowerProfileType
): Buffer {

  const { uploadSec } = powerProfileConfig(
    powerProfileType
  );

  // TODO: Quitar el 600 y traertlo de la constante
  return jt808CreateTemporaryLocationTrackingPacket(
    terminalId,
    counter,
    uploadSec,
    600)
}
export default jt808CreatePowerProfilePacket;
