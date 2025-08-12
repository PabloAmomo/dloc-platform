import { GoogleGeoPositionResponse } from "../../../../models/GoogleGeoPositionResponse";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { Persistence } from "../../../../models/Persistence";
import { PositionPacket } from "../../../../models/PositionPacket";
import HandlePacketResult from "../../models/HandlePacketResult";
import protoTopinPersistPosition from "./protoTopinPersistPosition";
import { ProtoTopinPacket } from "../models/ProtoTopinPacket";

const protoTopisPersistLbsResponse = async ({
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
  // TODO: Get the current position and time, and check if lbs response is valid
  
  if (lbsGetResponse && "location" in lbsGetResponse) {
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

export default protoTopisPersistLbsResponse;
