import { printMessage } from '../../../../functions/printMessage';
import Proto1903ProcessProps from '../models/Proto1903ProcessProps';
import proto1903CheckMustSendToTerminal from '../functions/proto1903CheckMustSendToTerminal';
import proto1903MustSendToTerminalRequestReport from '../functions/proto1903MustSendToTerminalRequestReport';
import Proto1903HandleProcess from '../models/Proto1903HandleProcess';

const proto1903HandleProcess: Proto1903HandleProcess = ({
  results,
  imei,
  prefix,
  counter,
  newConnection,
  powerProfileChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfileType,
  movementsControlSeconds,
  sendData
}: Proto1903ProcessProps): void => {
  let toSendAditional: string = "";
  if (newConnection || powerProfileChanged || needProfileRefresh) {
    const responseSend: string = proto1903CheckMustSendToTerminal(
      imei,
      prefix,
      powerProfileChanged,
      needProfileRefresh,
      imeiData.powerProfile,
      newPowerProfileType
    );

    toSendAditional += responseSend;
  }

  /** Check if must send to terminal request report */
  if (
    proto1903MustSendToTerminalRequestReport(imei, newPowerProfileType, imeiData)
  ) {
    toSendAditional += "TRVBP20#";
    printMessage(
      `${prefix} 📡 send command TRVBP20 (Force to report Position).`
    );
  }

  /** Create response to send */
  let toSend: string = "";
  for (let i = 0; i < results.length; i++) {
    if (results[i].response.length > 0) toSend += results[i].response.join("");
  }
  if (toSendAditional) toSend += toSendAditional;

  sendData([toSend]); 
};

export default proto1903HandleProcess;
