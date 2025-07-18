import { PowerProfileType } from "../../../../enums/PowerProfileType";
import Jt808ReportConfiguration from "../enums/Jt808reportConfiguration";
import jt808CreateIntervalReportPacket from "./jt808CreateIntervalReportPacket";
import jt808CreateTemporaryLocationTrackingPacket from "./jt808CreateTemporaryLocationTrackingPacket";
import jt808PowerProfileConfig from "./jt808GetPowerProfileConfig";

const jt808CreatePowerProfilePacket = (
  terminalId: string,
  counter: number,
  powerProfileType: PowerProfileType,
  durationSec: number,
  reportConfiguration: Jt808ReportConfiguration
): Buffer => {
  const { uploadSec, movementMeters } = jt808PowerProfileConfig(powerProfileType);

  return reportConfiguration === Jt808ReportConfiguration.temporaryTracking
    ? jt808CreateTemporaryLocationTrackingPacket(terminalId, counter, uploadSec, durationSec)
    : jt808CreateIntervalReportPacket(terminalId, counter, uploadSec, movementMeters);
};
export default jt808CreatePowerProfilePacket;
