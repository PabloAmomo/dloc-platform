import checkMustSendToTerminalRequestReport from '../../../../functions/checkMustSendToTerminalRequestReport';
import { printMessage } from '../../../../functions/printMessage';
import protoTopinCheckMustSendToTerminal from '../functions/protoTopinCheckMustSendToTerminal';
import protoTopinGetPowerProfileConfig from '../functions/protoTopinGetPowerProfileConfig';
import ProtoTopinHandleProcess from '../models/ProtoTopinHandleProcess';
import ProtoTopinProcessProps from '../models/ProtoTopinProcessProps';

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
  if (isNewConnection || powerProfileChanged || needProfileRefresh) {
    const responseSend: Buffer[] = protoTopinCheckMustSendToTerminal(
      imei,
      prefix,
      powerProfileChanged,
      needProfileRefresh,
      imeiData.powerProfile,
      newPowerProfileType,
      isNewConnection
    );

    responseSend.forEach((response) => {
      (results[0].response as Buffer[]).push(response);
    });
  }

  const { forceReportLocInSec } = protoTopinGetPowerProfileConfig(newPowerProfileType);

  /** Check if must send to terminal request report */
  if (checkMustSendToTerminalRequestReport(prefix, imei, imeiData, forceReportLocInSec)) {
    // TODO: Implement the logic for sending a request report
    printMessage(`${prefix} 📡 send packet to request report position.`);
  }

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
