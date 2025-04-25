import { PositionPacket } from '../../models/PositionPacket';

type getErrorFromPositionPacketResult = { errorMsg: string; message: string };

const getErrorFromPositionPacket = (positionPacket: PositionPacket): getErrorFromPositionPacketResult => {
  const imei: string = positionPacket.imei === '' ? '---------------' : positionPacket.imei;
  let errorMsg: string = '';
  let message: string = '';

  /** validate data */
  if (positionPacket.dateTimeUtc == null) {
    message = `[${imei}] (${positionPacket.remoteAddress}) invalid date time (Is null)`;
    errorMsg = 'invalid date time';
  } else if (!positionPacket || !positionPacket.valid || !positionPacket.imei) {
    message = `[${imei}] (${positionPacket.remoteAddress}) location without valid data [valid ${positionPacket.valid}]`;
    errorMsg = 'location without valid data';
  } else if (positionPacket.lat == null || positionPacket.lng == null) {
    message = `[${imei}] (${positionPacket.remoteAddress}) location without position [lat: ${positionPacket.lat ?? 'ND'} lng: ${positionPacket.lng ?? 'ND'} ]`;
    errorMsg = 'location without position';
  }

  /** return result */
  return { errorMsg, message };
};

export { getErrorFromPositionPacket };
