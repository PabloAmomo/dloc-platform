import { PowerProfileType } from "../../../../enums/PowerProfileType";
import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import { printMessage } from "../../../../functions/printMessage";
import jt808Config from "../config/jt808Config";
import Jt808ReportConfiguration from "../enums/Jt808reportConfiguration";
import jt808CreateCheckParameterSettingPacket from "./jt808CreateCheckParameterSettingPacket";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";
import jt808CreatePowerProfilePacket from "./jt808CreatePowerProfilePacket";
import jt808PowerProfileConfig from "./jt808GetPowerProfileConfig";

const jt808CheckMustSendToTerminal = (
  terminalId: string,
  prefix: string,
  powerPrfChanged: boolean,
  needProfileRefresh: boolean,
  counter: number,
  currentPowerPrfile: string,
  newPowerProfile: PowerProfileType
): Buffer[] => {
  const response: Buffer[] = [];
  const { uploadSec, heartBeatSec } = jt808PowerProfileConfig(newPowerProfile);
  const REPORT_CONFIGURATION: Jt808ReportConfiguration = jt808Config.REPORT_CONFIGURATION;
  const reportConfigurationText =
    REPORT_CONFIGURATION === Jt808ReportConfiguration.temporaryTracking
      ? "temporary location tracking"
      : "interval report";

  printMessage(`${prefix} 🎛️  Using report configuration [${reportConfigurationText}]`);
  printMessage(`${prefix} 📡 send Upload Interval [${uploadSec} sec]`);

  /** Create Power Profile Packets */
  const powerPackets = jt808CreatePowerProfilePacket(terminalId, counter + 201, newPowerProfile, REPORT_CONFIGURATION);
  response.push(...powerPackets);

  /* Create HeartBeat Packet */
  const heartBeatPacket = jt808CreateParameterSettingPacket(terminalId, counter + 210, [
    "00000001 04 " + createHexFromNumberWithNBytes(heartBeatSec, 4),
  ]);
  printMessage(`${prefix} ❤️  Heart beat config Packet sent - interval ${heartBeatSec} sec`);
  response.push(heartBeatPacket);

  /* Create parameters settings Packet */
  const parametersSettings = jt808CreateCheckParameterSettingPacket(terminalId, counter + 211, []);
  response.push(parametersSettings);
  printMessage(`${prefix} ⚙️  Parameters setting Packet sent`);

  return response;
};

export default jt808CheckMustSendToTerminal;
