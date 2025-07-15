import { PowerProfileType } from "../../../../enums/PowerProfileType";
import convertStringToHexString from "../../../../functions/convertStringToHexString";
import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import jt808PowerProfileConfig from "./jt808PowerProfileConfig";
import { printMessage } from "../../../../functions/printMessage";
import jt808CreateCheckParameterSettingPacket from "./jt808CreateCheckParameterSettingPacket";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";
import jt808CreatePowerProfilePacket from "./jt808CreatePowerProfilePacket";

const jt808CheckMustSendToTerminal = (
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
  const { uploadSec, heartBeatSec } = jt808PowerProfileConfig(newPowerProfile);

  if (needProfileRefresh)
    printMessage(
      `${prefix} 🔄 power profile refresh needed, current profile [${newPowerProfile}]`
    );

  if (powerPrfChanged)
    printMessage(
      `${prefix} ⚡️ power profile changed from [${currentPowerPrfile}] to [${newPowerProfile}]`
    );

  // Sending power profile packet by configuration parameters don't work
  //jt808CreateReportIntervalsParameters(
  //  terminalId,
  //  counter,
  //  uploadSec,
  //  prefix,
  //  response
  //);

  /** Create Power Profile Packet */
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
    counter + 210,
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
    counter + 211,
    []
  );
  response.push(parametersSettings);
  printMessage(`${prefix} ⚙️  Parameters setting Packet sent`);

  return response;
};

export default jt808CheckMustSendToTerminal;
