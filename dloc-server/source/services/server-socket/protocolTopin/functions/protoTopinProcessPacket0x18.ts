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

  // TODO: [FETURE] Extract Wifi data (MACs, RSSI, etc.) from the packet

  printMessage(`${prefix} 📡 wifi data packet received (0x18) (LOGIC PENDING)`);

  const { year, month, day, hours, minutes, seconds } = getDateTimeValues(new Date(), true);
  (response.response as Buffer[]).push(
    protoTopinCreateResponse0x18(topinPacket, Buffer.from([year, month, day, hours, minutes, seconds]))
  );

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x18;
