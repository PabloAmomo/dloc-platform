import jt808CheckMustSendToTerminal from '../functions/jt808CheckMustSendToTerminal';
import jt808FrameEncode from '../functions/jt808FrameEncode';
import Jt808HandleProcess from '../models/Jt808HandleProcess';
import Jt808ProcessProps from '../models/Jt808ProcessProps';

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
  movementsControlSeconds,
  sendData,
}: Jt808ProcessProps): void => {
  if (isNewConnection || powerProfileChanged || needProfileRefresh) {
    const responseSend: Buffer[] = jt808CheckMustSendToTerminal(
      imei,
      prefix,
      powerProfileChanged,
      needProfileRefresh,
      counter,
      imeiData.powerProfile,
      newPowerProfileType,
      movementsControlSeconds
    );

    responseSend.forEach((response) => {
      (results[0].response as Buffer[]).push(response);
    });
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
