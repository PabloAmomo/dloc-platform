import { GoogleGeoPositionResponse } from "../models/GoogleGeoPositionResponse";
import { GpsAccuracy } from "../models/GpsAccuracy";
import { Persistence } from "../models/Persistence";
import { PositionPacket } from "../models/PositionPacket";
import HandlePacketResult from "../services/server-socket/models/HandlePacketResult";
import protoTopinPersistPosition from "../services/server-socket/protocolTopin/functions/protoTopinPersistPosition";
import { ProtoTopinPacket } from "../services/server-socket/protocolTopin/models/ProtoTopinPacket";

const protoToppisPersistLbsResponse = async ({
  imei,
  remoteAddress,
  lbsGetResponse,
  persistence,
  topinPacket,
  dateTimeUtc,
  prefix,
  response,
  gsmSignal,
  batteryLevel,
}: {
  imei: string;
  remoteAddress: string;
  lbsGetResponse: GoogleGeoPositionResponse | {};
  persistence: Persistence;
  topinPacket: ProtoTopinPacket;
  dateTimeUtc: Date;
  prefix: string;
  response: HandlePacketResult;
  gsmSignal: number;
  batteryLevel: number;
}): Promise<void> => {
  if ("location" in lbsGetResponse) {
    const location: PositionPacket = {
      imei,
      remoteAddress,
      dateTimeUtc,
      valid: true,
      lat: lbsGetResponse.location.lat,
      lng: lbsGetResponse.location.lng,
      speed: 0,
      directionAngle: 0,
      gsmSignal,
      batteryLevel,
      accuracy: GpsAccuracy.lbs,
      activity: "{}",
    };
    protoTopinPersistPosition(imei, remoteAddress, location, persistence, topinPacket, response, prefix);
  }
};

export default protoToppisPersistLbsResponse;
