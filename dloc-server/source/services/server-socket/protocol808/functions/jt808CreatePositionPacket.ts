import { GpsAccuracy } from '../../../../models/GpsAccuracy';
import { PositionPacket } from '../../../../models/PositionPacket';
import { printMessage } from '../../../../functions/printMessage';
import { Jt808LocationPacket } from '../models/Jt808LocationPacket';
import parseDateTimeToUtcDateTime from '../../../../functions/parseDateTimeToUtcDateTime';

const jt808CreatePositionPacket = (imei: string, remoteAddress: string, locationPacket: Jt808LocationPacket, activity: string): PositionPacket | undefined => {
  try {
    return {
      imei,
      remoteAddress,
      dateTimeUtc: parseDateTimeToUtcDateTime(locationPacket.time),
      valid: locationPacket.lat !== 0 && locationPacket.lng !== 0,
      lat: locationPacket.lat,
      lng: locationPacket.lng,
      speed: locationPacket.speed,
      directionAngle: locationPacket.direction,
      gsmSignal: locationPacket.gsmSignal ?? 0,
      batteryLevel: locationPacket.batteryLevel ?? -1,
      accuracy: GpsAccuracy.gps, 
      activity,
    };
  } catch (err: Error | any) {
    printMessage(`[${imei}] (${remoteAddress}) ❌ error creating position packet [${err.message}]`);
    return undefined;
  }
};

export default jt808CreatePositionPacket;
