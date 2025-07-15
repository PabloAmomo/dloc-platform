import { printMessage } from '../../../functions/printMessage';
import Proto1903HandlerProcess from './models/Proto1903HandlerProcess';
import Proto1903HandlerProcessProps from './models/Proto1903HandlerProcessProps';
import proto1903CheckMustSendToTerminal from '../../../services/server-socket/protocol1903/functions/proto1903CheckMustSendToTerminal';
import proto1903MustSendToTerminalRequestReport from '../../../services/server-socket/protocol1903/functions/proto1903MustSendToTerminalRequestReport';

const Proto1903HandlerProcess: Proto1903HandlerProcess = ({
  conn,
  results,
  imei,
  prefix,
  counter,
  newConnection,
  powerPrfChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfile,
  movementsControlSeconds,
}: Proto1903HandlerProcessProps): void => {
  let toSendAditional: string = "";
  if (newConnection || powerPrfChanged || needProfileRefresh) {
    const responseSend: string = proto1903CheckMustSendToTerminal(
      imei,
      prefix,
      powerPrfChanged,
      needProfileRefresh,
      imeiData.powerProfile,
      newPowerProfile
    );

    toSendAditional += responseSend;
  }

  /** Check if must send to terminal request report */
  if (
    proto1903MustSendToTerminalRequestReport(imei, newPowerProfile, imeiData)
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
  conn.write(toSend);
};

export default Proto1903HandlerProcess;
