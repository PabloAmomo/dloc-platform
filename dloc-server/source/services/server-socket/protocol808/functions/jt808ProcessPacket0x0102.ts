import { getNormalizedIMEI } from '../../../../functions/getNormalizedIMEI';
import padNumberLeft from '../../../../functions/padNumberLeft';
import { Jt808ProcessPacket } from '../models/Jt808ProcessPacket';
import jt808CreateCheckParameterSettingPacket from './jt808CreateCheckParameterSettingPacket';
import jt808CreateGeneralResponse from './jt808CreateGeneralResponse';
import jt808CreateQueryLocationMessage from './jt808CreateQueryLocationMessage';
import jt808PrintMessage from './jt808PrintMessage';

const jt808ProcessPacket0x0102: Jt808ProcessPacket = ({
  remoteAddress,
  response,
  jt808Packet,
  counter,
}) => {
  (response.response as Buffer[]).push(
    jt808CreateGeneralResponse(
      jt808Packet.header.terminalId,
      counter,
      jt808Packet.header.msgSerialNumber,
      jt808Packet.header.msgType,
      "00"
    )
  );

  (response.response as Buffer[]).push(
    jt808CreateQueryLocationMessage(
      jt808Packet.header.terminalId,
      counter + 100
    )
  );

  (response.response as Buffer[]).push(
    jt808CreateCheckParameterSettingPacket(
      jt808Packet.header.terminalId,
      counter + 102,
      []
    )
  );

  response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");

  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = true;

  jt808PrintMessage(imei, remoteAddress, jt808Packet.header.msgType);

  return {
    updateLastActivity,
    imei,
  };
};

export default jt808ProcessPacket0x0102;
