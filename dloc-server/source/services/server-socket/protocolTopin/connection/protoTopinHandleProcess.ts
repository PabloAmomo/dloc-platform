import { printMessage } from "../../../../functions/printMessage";
import ProtoTopinProcessProps from "../models/ProtoTopinProcessProps";
import protoTopinCheckMustSendToTerminal from "../functions/protoTopinCheckMustSendToTerminal";
import checkMustSendToTerminalRequestReport from "../../../../functions/checkMustSendToTerminalRequestReport";
import ProtoTopinHandleProcess from "../models/ProtoTopinHandleProcess";
import protoTopinGetPowerProfileConfig from "../functions/protoTopinGetPowerProfileConfig";

const protoTopinHandleProcess: ProtoTopinHandleProcess = ({
  results,
  imei,
  prefix,
  isNewConnection,
  powerProfileChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfileType,
  sendData,
}: ProtoTopinProcessProps): void => {
  let toSendAditional: string = "";
  // TODO: Implement the logic for handling the Topin protocol
  //if (isNewConnection || powerProfileChanged || needProfileRefresh) {
  //  const responseSend: string = protoTopinCheckMustSendToTerminal(
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

  //const { forceReportLocInSec } = protoTopinGetPowerProfileConfig(newPowerProfileType);

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

export default protoTopinHandleProcess;
