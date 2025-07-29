import { GpsAccuracy } from "../../models/GpsAccuracy";
import { PositionPacket } from "../../models/PositionPacket";

export interface CachePosition extends PositionPacket {}

export const CachePositionEmptyItem: CachePosition = {
  imei: "",
  remoteAddress: "",
  dateTimeUtc: new Date(0),
  valid: false,
  lat: null,
  lng: null,
  speed: 0,
  directionAngle: 0,
  gsmSignal: -1,
  batteryLevel: -1,
  accuracy: GpsAccuracy.unknown,
  activity: "",
};