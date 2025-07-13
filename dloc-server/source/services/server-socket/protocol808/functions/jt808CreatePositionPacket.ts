import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { PositionPacket } from "../../../../models/PositionPacket";
import { printMessage } from "../../../../functions/printMessage";
import { Jt808LocationPacket } from "../models/Jt808LocationPacket";

const MAX_TIME_DIFFERENCE_MS = 300000; // 5 minutes in milliseconds

const jt808CreatePositionPacket = (
  imei: string,
  remoteAddress: string,
  locationPacket: Jt808LocationPacket,
  activity: string
): PositionPacket | undefined => {
  try {
    const dateTimeUtc = new Date(locationPacket.dateTimeUTC);

    const now = new Date();
    const currentTimeUtc = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds()
    );

    const timeDifference = Math.abs(
      currentTimeUtc.getTime() - dateTimeUtc.getTime()
    );

    if (timeDifference > MAX_TIME_DIFFERENCE_MS) {
      printMessage(
        `[${imei}] (${remoteAddress}) ❌ Location packet date/time is not within 5 minutes of the current time.`
      );
      return undefined;
    }

    return {
      imei,
      remoteAddress,
      dateTimeUtc,
      valid: locationPacket.lat !== 0 && locationPacket.lng !== 0,
      lat: locationPacket.lat,
      lng: locationPacket.lng,
      speed: locationPacket.speed,
      directionAngle: locationPacket.direction,
      gsmSignal: locationPacket.gsmSignal ?? -1,
      batteryLevel: locationPacket.batteryLevel ?? -1,
      accuracy: GpsAccuracy.gps,
      activity,
    };
  } catch (err: Error | any) {
    printMessage(
      `[${imei}] (${remoteAddress}) ❌ error creating position packet [${err.message}]`
    );
    return undefined;
  }
};

export default jt808CreatePositionPacket;
