import config from "../../../../config/config";
import { printMessage } from "../../../../functions/printMessage";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { PositionPacket } from "../../../../models/PositionPacket";

const MAX_TIME_DIFFERENCE_MS = config.MAX_TIME_DATETIME_DIFFERENCE_MS;
const PACKET_LENGTH = 18; 

const protoTopinCreatePositionPacket = (
  imei: string,
  remoteAddress: string,
  prefix: string,
  data: Buffer,
  accuracy: GpsAccuracy,
  activity: string
): PositionPacket | undefined => {
  try {
    if (data.length < PACKET_LENGTH) {
      printMessage(`${prefix} ❌ Invalid packet length ${data.length}.`);
      return;
    }

    const dateBytes = data.slice(0, 6);
    const year = 2000 + dateBytes[0];
    const month = dateBytes[1];
    const day = dateBytes[2];
    const hours = dateBytes[3];
    const minutes = dateBytes[4];
    const seconds = dateBytes[5];
    const dateTimeUtcString = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.000Z`;
    const dateTimeUtc = new Date(dateTimeUtcString);

    const timeDifference = dateTimeUtc.getTime() - new Date().getTime();
    const minutesAfterNow = timeDifference / 1000 / 60;
    if (timeDifference > MAX_TIME_DIFFERENCE_MS) {
      printMessage(
        `${prefix} ❌ Location packet date/time is ${minutesAfterNow} minutes in the future of the current time.`
      );
      return;
    }

    const rawLat = data.readUInt32BE(7) / 30000 / 60;
    const rawLng = data.readUInt32BE(11) / 30000 / 60;

    const speed = data[15]; // Speed in km/h

    const statusBytes = data.slice(16, 18);
    const valid = (statusBytes[0] & 0x10) >> 4 === 1;
    const eastWest = (statusBytes[0] & 0x08) >> 3; // 0 = East, 1 = West
    const southNorth = (statusBytes[0] & 0x04) >> 2; // 0 = South, 1 = North

    const lat = southNorth ? rawLat : -rawLat; // North is positive, South is negative
    const lng = eastWest ? -rawLng : rawLng; // East is positive,

    const high = statusBytes[0] & 0x03; // bits 0 y 1
    const low = statusBytes[1]; // 8 bits completos
    const directionAngle = (high << 8) | low;

    return {
      imei,
      remoteAddress,
      dateTimeUtc,
      valid,
      lat,
      lng,
      speed,
      directionAngle,
      gsmSignal: -1,
      batteryLevel: -1,
      accuracy,
      activity,
    };
  } catch (err: Error | any) {
    printMessage(`${prefix} ❌ error creating position packet [${err.message}]`);
  }
};

export default protoTopinCreatePositionPacket;
