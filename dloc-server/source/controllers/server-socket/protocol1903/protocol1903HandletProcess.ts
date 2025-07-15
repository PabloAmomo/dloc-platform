import { printMessage } from "../../../functions/printMessage";
import proto1903CheckMustSendToTerminal from "../../../services/server-socket/protocol1903/functions/proto1903CheckMustSendToTerminal";
import proto1903MustSendToTerminalRequestReport from "../../../services/server-socket/protocol1903/functions/proto1903MustSendToTerminalRequestReport";
import { ServerSocketHandlerProcessProps } from "../../../models/ServerSocketHandlerProcessProps";
import { ServerSocketHandlerProcess } from "../../../models/ServerSocketHandlerProcess";

const protocol1903HandlerProcess: ServerSocketHandlerProcess  = ({ 
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
  movementsControlSeconds
} : ServerSocketHandlerProcessProps) : void =>  {
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
  if (proto1903MustSendToTerminalRequestReport(imei, newPowerProfile, imeiData)) {
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

export { protocol1903HandlerProcess as protocol1903HanlderProcess };
