import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { PositionPacket } from "../../../../models/PositionPacket";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreatePositionPacket from "./protoTopinCreatePositionPacket";
import protoTopinCreateResponse0x11 from "./protoTopinCreateResponse0x11";
import protoTopinPersistPosition from "./protoTopinPersistPosition";

const protoTopinProcessPacket0x11: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  const location: PositionPacket | undefined = protoTopinCreatePositionPacket(
    response.imei,
    remoteAddress,
    prefix,
    topinPacket.informationContent,
    GpsAccuracy.gps,
    "{}"
  );

  if (location)
    protoTopinPersistPosition(response.imei, remoteAddress, location, persistence, topinPacket, response, prefix);

  const dateBytes = topinPacket.informationContent.slice(0, 6);
  (response.response as Buffer[]).push(protoTopinCreateResponse0x11(topinPacket, dateBytes));

  return {
    updateLastActivity: false,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x11;
