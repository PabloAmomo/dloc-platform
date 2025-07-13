import { PositionPacket } from "../../models/PositionPacket";

export interface CachePosition extends PositionPacket{
  datetimeUtc: Date;
}