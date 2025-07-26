import { Direction } from "../../../../models/Direction";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { PositionPacket } from "../../../../models/PositionPacket";
import { parseLatOrLng } from "../../../../functions/parseLatOrLng";
import { parseUtcDateTime } from "../../../../functions/parseUtcDateTime";
import { printMessage } from "../../../../functions/printMessage";

// TODO: Move this constant to a shared configuration file
const MAX_TIME_DIFFERENCE_MS = 300000; // 5 minutes in milliseconds

// TODO: Use for 0x18 y 0x19
const protoTopinCreatePositionPacketEx = (
  imei: string,
  remoteAddress: string,
  prefix: string,
  data: Buffer,
  accuracy: GpsAccuracy,
  activity: string
): PositionPacket | undefined => {
  try {
    if (data.length < 17) {
      printMessage(`${prefix} ❌ Invalid position packet length: ${data.length}`);
      return;
    }

    const gsmSignal = -1;
    const batteryLevel = -1;

 
    const year = 2000 + parseInt(data[0].toString(16).padStart(2, "0"));
    const month = data[1].toString(16).padStart(2, "0");
    const day = data[2].toString(16).padStart(2, "0");
    const hours = data[3].toString(16).padStart(2, "0");
    const minutes = data[4].toString(16).padStart(2, "0");
    const seconds = data[5].toString(16).padStart(2, "0");
    const dateTimeUtcString = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.000Z`;
    const dateTimeUtc = new Date(dateTimeUtcString);

    //const gpsDataLengthAndSatellites = data[6];
    //const gpsDataLength = gpsDataLengthAndSatellites & 0x0f;
    //const satellites = (gpsDataLengthAndSatellites & 0xf0) >> 4;
    //console.log(`${prefix} 📍 ---> gpsDataLength ${gpsDataLength}`);
    //console.log(`${prefix} 📍 ---> satellites ${satellites}`);

    const lat = data.readUInt32BE(7);
    const lng = data.readUInt32BE(11);


    console.log(` 📍 ---> latitud ${lat.toFixed(7)}`);
    console.log(` 📍 ---> longitud ${lng.toFixed(7)}`);

    const speed = data[15]; // in km/h
    const status1 = data[16];
    const status2 = data[17];
    const valid = (status1 & 0x04) >> 2 === 1;

    const statusBits = (status1 << 8) | status2;
    const eastWest = (status1 & 0x02) >> 1;
    const northSouth = status1 & 0x01;
    const directionAngle = statusBits & 0x03ff;

    const timeDifference = dateTimeUtc.getTime() - new Date().getTime();
    const minutesAfterNow = timeDifference / 1000 / 60;
    if (timeDifference > MAX_TIME_DIFFERENCE_MS) {
      printMessage(
        `${prefix} ❌ Location packet date/time is ${minutesAfterNow} minutes or more in the future of the current time.`
      );
      return;
    }

    return {
      imei,
      remoteAddress,
      dateTimeUtc,
      valid,
      lat: 0,
      lng: 0,
      speed,
      directionAngle,
      gsmSignal,
      batteryLevel,
      accuracy,
      activity,
    };
  } catch (err: Error | any) {
    printMessage(`${prefix} ❌ error creating extended position packet [${err.message}]`);
  }
};

export default protoTopinCreatePositionPacketEx;

function decodeCoordinateFromUInt32(intValue: number): number {
  const degrees = Math.floor(intValue / 1e7);
  const decimal = (intValue % 1e7) / 1e7;
  return degrees + decimal;
}