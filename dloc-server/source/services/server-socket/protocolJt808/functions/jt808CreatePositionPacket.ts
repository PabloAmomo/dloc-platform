import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { PositionPacket } from "../../../../models/PositionPacket";
import { printMessage } from "../../../../functions/printMessage";
import { Jt808LocationPacket } from "../models/Jt808LocationPacket";
import config from "../../../../config/config";

const MAX_TIME_DIFFERENCE_MS = config.MAX_TIME_DATETIME_DIFFERENCE_MS;

const jt808CreatePositionPacket = (
  imei: string,
  remoteAddress: string,
  locationPacket: Jt808LocationPacket,
  activity: string
): PositionPacket | undefined => {
  try {
    const dateTimeUtc = new Date(locationPacket.dateTimeUTC);
    const now = new Date();

    const timeDifference = dateTimeUtc.getTime() - now.getTime();
    const minutesAfterNow = timeDifference / 1000 / 60;
    if (timeDifference > MAX_TIME_DIFFERENCE_MS) {
      printMessage(
        `[${imei}] (${remoteAddress}) ❌ Location packet date/time is ${minutesAfterNow} minutes in the future of the current time.`
      );
      return;
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
    printMessage(`[${imei}] (${remoteAddress}) ❌ error creating position packet [${err.message}]`);
    return;
  }
};

export default jt808CreatePositionPacket;
