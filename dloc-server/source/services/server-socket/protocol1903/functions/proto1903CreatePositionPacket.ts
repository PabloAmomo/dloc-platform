import { Direction } from '../../../../models/Direction';
import { GpsAccuracy } from '../../../../models/GpsAccuracy';
import { PositionPacket } from '../../../../models/PositionPacket';
import { parseLatOrLng } from '../../../../functions/parseLatOrLng';
import { parseUtcDateTime } from '../../../../functions/parseUtcDateTime';
import { printMessage } from '../../../../functions/printMessage';

const proto1903CreatePositionPacket = (imei: string, remoteAddress: string, values: string[], accuracy: GpsAccuracy, activity: string): PositionPacket | undefined => {
  try {
    return {
      imei,
      remoteAddress,
      dateTimeUtc: parseUtcDateTime(values[2], values[9]),
      valid: (values[3] ?? '').toUpperCase().trim() === 'A',
      lat: parseLatOrLng(values[4], values[5] as Direction),
      lng: parseLatOrLng(values[6], values[7] as Direction),
      speed: parseInt(values[8] ?? '0'),
      directionAngle: parseInt(values[10] ?? '0'),
      gsmSignal: parseInt(values[11] ?? '-1'),
      batteryLevel: parseInt(values[13] ?? '-1'),
      accuracy,
      activity,
    };
  } catch (err: Error | any) {
    printMessage(`[${imei}] (${remoteAddress}) ❌ error creating position packet [${err.message}]`);
    return undefined;
  }
};

export default proto1903CreatePositionPacket;
