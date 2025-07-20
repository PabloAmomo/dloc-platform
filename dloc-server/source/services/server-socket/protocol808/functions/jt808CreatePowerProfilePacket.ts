import { report } from "process";
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
  reportConfiguration: Jt808ReportConfiguration,
  prefix: string
): Buffer[] => {
  const { uploadSec, movementMeters } = jt808PowerProfileConfig(powerProfileType);
  const responseArray: Buffer[] = [];

  const isTemporaryTracking = reportConfiguration === Jt808ReportConfiguration.temporaryTracking;
  const isIntervalReport = reportConfiguration === Jt808ReportConfiguration.intervalReport;
  const isHybridReport = reportConfiguration === Jt808ReportConfiguration.hybridRport;

  const hasHybridTracking =
    isHybridReport &&
    (powerProfileType === PowerProfileType.AUTOMATIC_FULL || powerProfileType === PowerProfileType.FULL);

  /** Create wake up packet */
  // TODO: [TESTING] Test if this packet is needed
  //responseArray.push(jt808CreateWakeupPacket(terminalId, counter++));
  //printMessage(`${prefix} 🔋 Wake up packet sent [${counter}]`);

  if (isTemporaryTracking || isHybridReport) {
    const { MOVEMENTS_CONTROL_SECONDS } = config;
    const durationSec = MOVEMENTS_CONTROL_SECONDS + uploadSec;

    /* Send temporary location tracking clean packet */
    responseArray.push(jt808CreateTemporaryLocationTrackingPacket(terminalId, counter++, 0, 0, prefix));

    if (hasHybridTracking)
      printMessage(`${prefix} ⚡️ HybridReport with power profile ${powerProfileType}. Send tracking packet 🚀 [${counter}]`);

    /* Send temporary location tracking packet */
    if (isTemporaryTracking || hasHybridTracking)
      responseArray.push(
        jt808CreateTemporaryLocationTrackingPacket(terminalId, counter++, uploadSec, durationSec, prefix)
      );
  }

  if (isIntervalReport)
    responseArray.push(jt808CreateIntervalReportPacket(terminalId, counter++, uploadSec, movementMeters));

  return responseArray;
};

export default jt808CreatePowerProfilePacket;
