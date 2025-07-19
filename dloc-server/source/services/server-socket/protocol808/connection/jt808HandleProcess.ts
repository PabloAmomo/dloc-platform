import checkMustSendToTerminalRequestReport from "../../../../functions/checkMustSendToTerminalRequestReport";
import { printMessage } from "../../../../functions/printMessage";
import jt808Config from "../config/jt808Config";
import jt808CheckMustSendToTerminal from "../functions/jt808CheckMustSendToTerminal";
import jt808CreateQueryLocationMessage from "../functions/jt808CreateQueryLocationMessage";
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

  if (isNewConnection || powerProfileChanged || needProfileRefresh) {
    const responseSend: Buffer[] = jt808CheckMustSendToTerminal(
      terminalId,
      prefix,
      powerProfileChanged,
      needProfileRefresh,
      counter,
      imeiData.powerProfile,
      newPowerProfileType,
    );

    responseSend.forEach((response) => {
      (results[0].response as Buffer[]).push(response);
    });
  }

  /** Check if must send to terminal request report */
  const { forceReportLocInSec } = jt808GetPowerProfileConfig(newPowerProfileType);
  if (checkMustSendToTerminalRequestReport(prefix, imei, imeiData, forceReportLocInSec)) {
    const packet = jt808CreateQueryLocationMessage(terminalId, counter + 110);
    (results[0].response as Buffer[]).push(packet);
    printMessage(`${prefix} 🧭 🔥🔥 Request location report to terminal... (Force after ${forceReportLocInSec} seconds)`);
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
