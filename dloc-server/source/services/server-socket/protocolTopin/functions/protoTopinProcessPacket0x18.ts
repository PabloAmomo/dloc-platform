import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import { PositionPacket } from "../../../../models/PositionPacket";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { printMessage } from "../../../../functions/printMessage";
import protoTopinCreateResponse0x18 from "./protoTopinCreateResponse0x18";
import protoTopinPersistPosition from "./protoTopinPersistPosition";
import getDateTimeValues from "../../../../functions/getDateTimeValues";
import config from "../../../../config/config";

const MAX_TIME_DIFFERENCE_MS = config.MAX_TIME_DIFFERENCE_MS;

const protoTopinProcessPacket0x18: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  const positions: PositionPacket[] = [];
  const responseVal = {
    updateLastActivity: false,
    imei: response.imei,
    mustDisconnect: false,
  };

  let { year, month, day, hours, minutes, seconds } = getDateTimeValues(new Date());

  let offset = 0;
  while (offset + 17 <= topinPacket.informationContent.length) {
    if (topinPacket.informationContent.length < 17) {
      printMessage(`${prefix} ❌ Invalid position packet length: ${topinPacket.informationContent.length}`);
      continue;
    }

    const record = topinPacket.informationContent.slice(offset, offset + 17);

    const year = 2000 + parseInt(record[0].toString(16).padStart(2, "0"));
    const month = record[1].toString(16).padStart(2, "0");
    const day = record[2].toString(16).padStart(2, "0");
    const hours = record[3].toString(16).padStart(2, "0");
    const minutes = record[4].toString(16).padStart(2, "0");
    const seconds = record[5].toString(16).padStart(2, "0");
    const dateTimeUtcString = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T${hours
      .toString()
      .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.000Z`;
    const dateTimeUtc = new Date(dateTimeUtcString);

    console.log(` 📍 ---> latitud ${record.readUInt32BE(6)}`);
    console.log(` 📍 ---> longitud ${record.readUInt32BE(10)}`);

    const latitude = record.readUInt32BE(6) / 30000 / 60;
    const longitude = record.readUInt32BE(10) / 30000 / 60;

    const status1 = record[15];
    const status2 = record[16];

    const statusBits = (status1 << 8) | status2;
    const eastWest = (status1 & 0x02) >> 1;
    const northSouth = status1 & 0x01;

    const timeDifference = dateTimeUtc.getTime() - new Date().getTime();
    const minutesAfterNow = timeDifference / 1000 / 60;
    if (timeDifference > MAX_TIME_DIFFERENCE_MS) {
      printMessage(
        `${prefix} ❌ Location packet date/time is ${minutesAfterNow} minutes in the future of the current time.`
      );
      return responseVal;
    }

    positions.push({
      imei: response.imei,
      remoteAddress,
      dateTimeUtc,
      valid: (status1 & 0x04) >> 2 === 1,
      lat: northSouth ? latitude : -latitude,
      lng: eastWest ? -longitude : longitude,
      speed: record[14], // Speed in km/h
      directionAngle: statusBits & 0x03ff,
      gsmSignal: -1,
      batteryLevel: -1,
      accuracy: GpsAccuracy.gps,
      activity: "{}",
    });

    offset += 17;
  }

  (response.response as Buffer[]).push(
    protoTopinCreateResponse0x18(topinPacket, Buffer.from([year, month, day, hours, minutes, seconds]))
  );

  if (positions.length === 0) {
    printMessage(`${prefix} ❌ No valid position data found in the packet.`);
    return responseVal;
  }

  for (const position of positions) {
    protoTopinPersistPosition(response.imei, remoteAddress, position, persistence, topinPacket, response, prefix);
  }

  return responseVal;
};

export default protoTopinProcessPacket0x18;
