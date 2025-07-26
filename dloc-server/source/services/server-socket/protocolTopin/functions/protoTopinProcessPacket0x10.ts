import positionAddPositionAndUpdateDevice from "../../../../functions/positionAddPositionAndUpdateDevice";
import { printMessage } from "../../../../functions/printMessage";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { PositionPacket } from "../../../../models/PositionPacket";
import discardData from "../../functions/discardData";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreateResponse0x10 from "./protoTopinCreateResponse0x10";
import protoTopinPersistPosition from "./protoTopinPersistPosition";

// TODO: Move this constant to a shared configuration file
const MAX_TIME_DIFFERENCE_MS = 300000; // 5 minutes in milliseconds

// TODO: Unify wit protoTopinProcessPacket0x18
const protoTopinProcessPacket0x10: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  const errorResponse = {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };

  if (topinPacket.informationContent.length < 18) {
    printMessage(`${prefix} ❌ Invalid packet length for 0x10.`);
    return errorResponse;
  }

  const dateBytes = topinPacket.informationContent.slice(0, 6);
  const year = 2000 + dateBytes[0];
  const month = dateBytes[1];
  const day = dateBytes[2];
  const hours = dateBytes[3];
  const minutes = dateBytes[4];
  const seconds = dateBytes[5];

  console.log(` 📍 ---> latitud ${topinPacket.informationContent.readUInt32BE(7)}`);
  console.log(` 📍 ---> longitud ${topinPacket.informationContent.readUInt32BE(11)}`);

  const lat = topinPacket.informationContent.readUInt32BE(7) / 30000 / 60;
  const lng = topinPacket.informationContent.readUInt32BE(11) / 30000 / 60;
  const statusBytes = topinPacket.informationContent.slice(16, 18);
  const statusBits = (statusBytes[0] << 8) | statusBytes[1];
  const eastWest = (statusBytes[0] & 0x02) >> 1; // 0 = East, 1 = West
  const northSouth = statusBytes[0] & 0x01; // 0 = Norte, 1 = Sur
  const dateTimeUtcString = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const dateTimeUtc = new Date(dateTimeUtcString);

  const timeDifference = dateTimeUtc.getTime() - new Date().getTime();
  if (timeDifference > MAX_TIME_DIFFERENCE_MS) {
    printMessage(
      `${prefix} ❌ Location packet date/time is ${
        MAX_TIME_DIFFERENCE_MS / 60
      } minutes or more in the future of the current time.`
    );
    return errorResponse;
  }

  const location: PositionPacket = {
    imei: response.imei,
    remoteAddress,
    dateTimeUtc,
    valid: (statusBytes[0] & 0x04) >> 2 === 1,
    lat: northSouth ? -lat : lat,
    lng: eastWest ? -lng : lng,
    speed: topinPacket.informationContent[15], // Speed in km/h
    directionAngle: statusBits & 0x03ff,
    gsmSignal: -1,
    batteryLevel: -1,
    accuracy: GpsAccuracy.gps,
    activity: "{}",
  };

  (response.response as Buffer[]).push(
    protoTopinCreateResponse0x10(topinPacket, Buffer.from([year, month, day, hours, minutes, seconds]))
  );

  protoTopinPersistPosition(response.imei, remoteAddress, location, persistence, topinPacket, response, prefix);

  return {
    updateLastActivity: false,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x10;
