import { GoogleGeoPositionResponse } from "../../../../models/GoogleGeoPositionResponse";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { Persistence } from "../../../../models/Persistence";
import { PositionPacket } from "../../../../models/PositionPacket";
import HandlePacketResult from "../../models/HandlePacketResult";
import protoTopinPersistPosition from "./protoTopinPersistPosition";
import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import checkLbsPositionIsValid from "../../../../functions/checkLbsPositionIsValid";

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

    if (await checkLbsPositionIsValid(imei, lbsGetResponse.location.lat, lbsGetResponse.location.lng, persistence, prefix))
      protoTopinPersistPosition(imei, remoteAddress, location, persistence, topinPacket, response, prefix);
  }
};

export default protoTopisPersistLbsResponse;
