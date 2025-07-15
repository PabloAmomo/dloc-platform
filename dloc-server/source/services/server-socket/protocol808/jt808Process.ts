import jt808CheckMustSendToTerminal from './functions/jt808CheckMustSendToTerminal';
import jt808FrameEncode from './functions/jt808FrameEncode';
import Jt808Process from './models/Jt808Process';
import Jt808ProcessProps from './models/Jt808ProcessProps';

const jt808Process: Jt808Process = ({
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
}: Jt808ProcessProps): void => {
  if (newConnection || powerPrfChanged || needProfileRefresh) {
    const responseSend: Buffer[] = jt808CheckMustSendToTerminal(
      imei,
      prefix,
      powerPrfChanged,
      needProfileRefresh,
      counter,
      imeiData.powerProfile,
      newPowerProfile,
      movementsControlSeconds
    );

    responseSend.forEach((response) => {
      (results[0].response as Buffer[]).push(response);
    });
  }

  /** Send */
  for (const result of results) {
    for (const response of result.response) {
      conn.write(jt808FrameEncode(response as Buffer));
      conn.write(Buffer.alloc(0));
    }
  }
};

export default jt808Process;
