import config from "../../../../config/config";
import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { printMessage } from "../../../../functions/printMessage";
import Jt808ReportConfiguration from "../enums/Jt808reportConfiguration";
import jt808CreateIntervalReportPacket from "./jt808CreateIntervalReportPacket";
import jt808CreateTemporaryLocationTrackingPacket from "./jt808CreateTemporaryLocationTrackingPacket";
import jt808CreateWakeupPacket from "./jt808CreateWakeupPacket";
import jt808PowerProfileConfig from "./jt808GetPowerProfileConfig";

const jt808CreatePowerProfilePacket = (
  terminalId: string,
  counter: number,
  powerProfileType: PowerProfileType,
  reportConfiguration: Jt808ReportConfiguration
): Buffer[] => {
  const { uploadSec, movementMeters } = jt808PowerProfileConfig(powerProfileType);
  const responseArray: Buffer[] = [];

  /** Create wake up packet */
  responseArray.push(jt808CreateWakeupPacket(terminalId, counter++));

  if (
    reportConfiguration === Jt808ReportConfiguration.temporaryTracking ||
    powerProfileType === PowerProfileType.AUTOMATIC_FULL ||
    powerProfileType === PowerProfileType.FULL
  ) {
    const { MOVEMENTS_CONTROL_SECONDS } = config;
    const durationSec = MOVEMENTS_CONTROL_SECONDS + uploadSec;

    if (reportConfiguration !== Jt808ReportConfiguration.temporaryTracking) {
      printMessage(
        `⚡️ Power profile type ${powerProfileType} then send temporary tracking packet 🚀`
      );
    }

    /* Send temporary location tracking cancel packet */
    responseArray.push(jt808CreateTemporaryLocationTrackingPacket(terminalId, counter++, 0, 0));

    /* Send temporary location tracking packet */
    responseArray.push(jt808CreateTemporaryLocationTrackingPacket(terminalId, counter++, uploadSec, durationSec));
  }

  if (reportConfiguration === Jt808ReportConfiguration.intervalReport)
    responseArray.push(jt808CreateIntervalReportPacket(terminalId, counter++, uploadSec, movementMeters));

  return responseArray;
};

export default jt808CreatePowerProfilePacket;
