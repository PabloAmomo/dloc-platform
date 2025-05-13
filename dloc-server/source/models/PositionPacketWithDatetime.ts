import { PositionPacket } from "./PositionPacket";

export interface PositionPacketWithDatetime extends PositionPacket{
  datetimeUtc: Date;
}