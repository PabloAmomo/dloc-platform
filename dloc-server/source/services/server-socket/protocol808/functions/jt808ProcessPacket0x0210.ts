import { getNormalizedIMEI } from '../../../../functions/getNormalizedIMEI';
import padNumberLeft from '../../../../functions/padNumberLeft';
import positionUpdateBatteryAndLastActivity from '../../../../functions/positionUpdateBatteryAndLastActivity';
import { printMessage } from '../../../../functions/printMessage';
import { Jt808ProcessPacket } from '../models/Jt808ProcessPacket';
import jt808CreateGeneralResponse from './jt808CreateGeneralResponse';
import jt808GetBatteryLevelPacketDateTime from './jt808GetBatteryLevelPacketDateTime';
import jt808PrintMessage from './jt808PrintMessage';

const jt808ProcessPacket0x0210: Jt808ProcessPacket = async ({
  remoteAddress,
  response,
  jt808Packet,
  counter,
  persistence,
}) => {
  const batteryLevel: number = jt808Packet.body.readUInt8(0);
  const dateTime = jt808GetBatteryLevelPacketDateTime(jt808Packet.body);

  (response.response as Buffer[]).push(
    jt808CreateGeneralResponse(
      jt808Packet.header.terminalId,
      counter,
      jt808Packet.header.msgSerialNumber,
      jt808Packet.header.msgType,
      "00"
    )
  );

  response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = false;

  printMessage(
    `[${imei}] (${remoteAddress}) 🔋 Battery level: ${batteryLevel}% at ${dateTime}`
  );

  await positionUpdateBatteryAndLastActivity(
    imei,
    remoteAddress,
    persistence,
    batteryLevel
  );

  jt808PrintMessage(imei, remoteAddress, jt808Packet.header.msgType);
  return {
    updateLastActivity,
    imei,
    mustDisconnect: false
  };
};

export default jt808ProcessPacket0x0210;
