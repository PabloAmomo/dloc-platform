import Proto1903HandlerProcess from '../protocol1903/models/Proto1903HandlerProcess';
import Proto1903HandlerProcessProps from '../protocol1903/models/Proto1903HandlerProcessProps';
import jt808CheckMustSendToTerminal from '../../../services/server-socket/protocol808/functions/jt808CheckMustSendToTerminal';
import jt808FrameEncode from '../../../services/server-socket/protocol808/functions/jt808FrameEncode';

const jt808HandlerProcess: Proto1903HandlerProcess = ({
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

export default jt808HandlerProcess;
