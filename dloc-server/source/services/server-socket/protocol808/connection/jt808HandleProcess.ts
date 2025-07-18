import jt808Config from '../config/jt808Config';
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
  sendData,
}: Jt808ProcessProps): void => {
  const movementsControlSeconds = jt808Config.REFRESH_POWER_PROFILE_EXTEND_SECONDS;
  
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

    // TODO: [FEATURE] (If needed) Implement request report logic for JT808 (j808CheckMustSendToTerminalRequestReport copy of proto1903CheckMustSendToTerminalRequestReport)

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
