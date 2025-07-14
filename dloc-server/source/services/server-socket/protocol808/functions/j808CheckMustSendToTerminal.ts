import { printMessage } from "../../../../functions/printMessage";
import jt808CreateCheckParameterSettingPacket from "./jt808CreateCheckParameterSettingPacket";
import convertStringToHexString from "../../../../functions/convertStringToHexString";
import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";
import jt808CreatePowerProfilePacket from "./jt808CreatePowerProfilePacket";
import { PowerProfileType } from "../../../../enums/PowerProfileType";
import powerProfileConfig from "../../../../functions/powerProfileConfig";

const j808CheckMustSendToTerminal = (
  imei: string,
  prefix: string,
  powerPrfChanged: boolean,
  needProfileRefresh: boolean,
  counter: number,
  currentPowerPrfile: string,
  newPowerProfile: PowerProfileType,
  movementsControlSeconds: number
): Buffer[] => {
  const response: Buffer[] = [];
  const terminalId = imei.slice(-12);
  const { uploadSec, heartBeatSec } = powerProfileConfig(newPowerProfile);

  if (needProfileRefresh)
    printMessage(
      `${prefix} 🔄 power profile refresh needed, current profile [${newPowerProfile}]`
    );

  if (powerPrfChanged)
    printMessage(
      `${prefix} ⚡️ power profile changed from [${currentPowerPrfile}] to [${newPowerProfile}]`
    );

  /** Create Power Profile Packet */
  // TODO: [FEATURE] Probar el usar los parametros 0x27, 0x28, 0x29 para el control de intervalos de movimiento
  const powerPacket = jt808CreatePowerProfilePacket(
    terminalId,
    counter + 200,
    newPowerProfile,
    movementsControlSeconds * 2
  );
  printMessage(`${prefix} 📡 send Upload Interval [${uploadSec} sec]`);
  printMessage(
    `${prefix} 🔋 Power config Packet sent: ${convertStringToHexString(
      powerPacket
    )}`
  );
  response.push(powerPacket);

  /* Create HeartBeat Packet */
  const heartBeatPacket = jt808CreateParameterSettingPacket(
    terminalId,
    counter + 201,
    ["00000001 04 " + createHexFromNumberWithNBytes(heartBeatSec, 4)]
  );
  printMessage(
    `${prefix} ❤️  Heart beat config Packet sent: ${convertStringToHexString(
      heartBeatPacket
    )}`
  );
  response.push(heartBeatPacket);

  /* Create parameters settings Packet */
  const parametersSettings = jt808CreateCheckParameterSettingPacket(
    terminalId,
    counter + 202,
    []
  );
  response.push(parametersSettings);
  printMessage(`${prefix} ⚙️  Parameters setting Packet sent`);

  return response;
};

export default j808CheckMustSendToTerminal;
