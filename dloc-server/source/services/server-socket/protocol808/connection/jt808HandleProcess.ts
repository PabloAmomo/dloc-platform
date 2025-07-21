import checkMustSendToTerminalRequestReport from "../../../../functions/checkMustSendToTerminalRequestReport";
import { printMessage } from "../../../../functions/printMessage";
import jt808Config from "../config/jt808Config";
import jt808CheckMustSendToTerminal from "../functions/jt808CheckMustSendToTerminal";
import jt808CreateQueryLocationMessage from "../functions/jt808CreateQueryLocationMessage";
import jt808CreateTemporaryLocationTrackingPacket from "../functions/jt808CreateTemporaryLocationTrackingPacket";
import jt808CreateWakeupPacket from "../functions/jt808CreateWakeupPacket";
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

    (results[0].response as Buffer[]).push(jt808CreateWakeupPacket(terminalId, count++));
    printMessage(`${prefix} 🔋 Wake up packet sent [${count}]`);

    // TODO: [TESTING] If better send and active tracking to activate the device?
    // TODO: [CONFIG] If work fine, move the durationSec and uploadSec to config
    const packet = jt808CreateTemporaryLocationTrackingPacket(terminalId, counter++, 10, 20, prefix);
    // const packet = jt808CreateQueryLocationMessage(terminalId, count++);
    (results[0].response as Buffer[]).push(packet);
    printMessage(`${prefix} 🧭 🔥🔥 Request location... (Force after ${forceReportLocInSec} seconds) [${count}]`);
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
