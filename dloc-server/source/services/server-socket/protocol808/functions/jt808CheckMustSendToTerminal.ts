import { PowerProfileType } from '../../../../enums/PowerProfileType';
import convertStringToHexString from '../../../../functions/convertStringToHexString';
import createHexFromNumberWithNBytes from '../../../../functions/createHexFromNumberWithNBytes';
import { printMessage } from '../../../../functions/printMessage';
import Jt808ReportConfiguration from '../enums/Jt808reportConfiguration';
import jt808CreateCheckParameterSettingPacket from './jt808CreateCheckParameterSettingPacket';
import jt808CreateParameterSettingPacket from './jt808CreateParameterSettingPacket';
import jt808CreatePowerProfilePacket from './jt808CreatePowerProfilePacket';
import jt808PowerProfileConfig from './jt808PowerProfileConfig';

// TODO: [CONFIGURATION] Move this to a configuration file
const REPORT_CONFIGURATION = Jt808ReportConfiguration.intervalReport;

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

  /** Create Power Profile Packet */
  const powerPacket = jt808CreatePowerProfilePacket(
    terminalId,
    counter + 200,
    newPowerProfile,
    movementsControlSeconds,
    REPORT_CONFIGURATION
  );
  printMessage(`${prefix} 🎛️ Using report configuration [${REPORT_CONFIGURATION}]`);
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
