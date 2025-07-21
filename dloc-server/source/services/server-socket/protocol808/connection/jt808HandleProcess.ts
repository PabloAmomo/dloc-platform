import { PowerProfileType } from "../../../../enums/PowerProfileType";
import checkMustSendToTerminalRequestReport from "../../../../functions/checkMustSendToTerminalRequestReport";
import { printMessage } from "../../../../functions/printMessage";
import jt808Config from "../config/jt808Config";
import Jt808ReportConfiguration from "../enums/Jt808reportConfiguration";
import jt808CheckMustSendToTerminal from "../functions/jt808CheckMustSendToTerminal";
import jt808CreateQueryLocationMessage from "../functions/jt808CreateQueryLocationMessage";
import jt808CreateTemporaryLocationTrackingPacket from "../functions/jt808CreateTemporaryLocationTrackingPacket";
import jt808FrameEncode from "../functions/jt808FrameEncode";
import jt808GetPowerProfileConfig from "../functions/jt808GetPowerProfileConfig";
import Jt808HandleProcess from "../models/Jt808HandleProcess";
import Jt808ProcessProps from "../models/Jt808ProcessProps";

const jt808HandleProcess: Jt808HandleProcess = ({
  results,
  imei,
  prefix,
  counter,
  isNewConnection,
  powerProfileChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfileType,
  sendData,
}: Jt808ProcessProps): void => {
  const terminalId = imei.slice(-12);
  const { REPORT_CONFIGURATION } = jt808Config;

  if (isNewConnection || powerProfileChanged || needProfileRefresh) {
    const responseSend: Buffer[] = jt808CheckMustSendToTerminal(
      terminalId,
      prefix,
      powerProfileChanged,
      needProfileRefresh,
      counter + 200,
      imeiData.powerProfile,
      newPowerProfileType
    );

    responseSend.forEach((response) => {
      (results[0].response as Buffer[]).push(response);
    });
  }

  /** Check if must send to terminal request report */
  const { forceReportLocInSec } = jt808GetPowerProfileConfig(newPowerProfileType);
  if (checkMustSendToTerminalRequestReport(prefix, imei, imeiData, forceReportLocInSec)) {
    let count = counter + 199;

    // TODO: [TESTING] If better send and active tracking to activate the device? (For hybrid and interval report)

    if (newPowerProfileType !== PowerProfileType.AUTOMATIC_FULL) {
      // TODO: [CONFIG] If work fine, move the intervalSec to config
      const intervalSec: number = 20;

      (results[0].response as Buffer[]).push(
        Jt808ReportConfiguration.temporaryTracking
          ? jt808CreateQueryLocationMessage(terminalId, count++)
          : jt808CreateTemporaryLocationTrackingPacket(terminalId, count++, intervalSec, intervalSec * 2, prefix)
      );

      printMessage(`${prefix} 🧭 🔥🔥 Request location... (Force after ${forceReportLocInSec} seconds) [${count}]`);
    }
  }

  /** Send */
  const toSend: Buffer[] = [];
  for (const result of results) {
    for (const response of result.response) {
      toSend.push(jt808FrameEncode(response as Buffer));
    }
  }

  sendData(toSend);
};

export default jt808HandleProcess;
