import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { Proto1903HandlePacketProps } from "./Proto1903HandlePacketProps";

export type Proto1903HandlePacket = (
  props: Proto1903HandlePacketProps
) => Promise<HandlePacketResult>;
