import { printMessage } from "../../../../functions/printMessage";
import ProtoGt06ProcessProps from "../models/ProtoGt06ProcessProps";
import protoGt06CheckMustSendToTerminal from "../functions/protoGt06CheckMustSendToTerminal";
import checkMustSendToTerminalRequestReport from "../../../../functions/checkMustSendToTerminalRequestReport";
import ProtoGt06HandleProcess from "../models/ProtoGt06HandleProcess";
import protoGt06GetPowerProfileConfig from "../functions/protoGt06GetPowerProfileConfig";

const protoGt06HandleProcess: ProtoGt06HandleProcess = ({
  results,
  imei,
  prefix,
  isNewConnection,
  powerProfileChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfileType,
  sendData,
}: ProtoGt06ProcessProps): void => {
  let toSendAditional: string = "";
  // TODO: Implement the logic for handling the GT06 protocol
  //if (isNewConnection || powerProfileChanged || needProfileRefresh) {
  //  const responseSend: string = protoGt06CheckMustSendToTerminal(
  //    imei,
  //    prefix,
  //    powerProfileChanged,
  //    needProfileRefresh,
  //    imeiData.powerProfile,
  //    newPowerProfileType
  //  );
  //
  //  toSendAditional += responseSend;
  //}

  //const { forceReportLocInSec } = protoGt06GetPowerProfileConfig(newPowerProfileType);

  /** Check if must send to terminal request report */
  //if (checkMustSendToTerminalRequestReport(prefix, imei, imeiData, forceReportLocInSec)) {
  //  toSendAditional += "TRVBP20#";
  //  printMessage(`${prefix} 📡 send command TRVBP20 (Force to report Position).`);
  //}

  /** Send */
  const toSend: Buffer[] = [];
  for (const result of results) {
    for (const response of result.response) {
      toSend.push(response as Buffer);
    }
  }

  sendData(toSend);
};

export default protoGt06HandleProcess;
