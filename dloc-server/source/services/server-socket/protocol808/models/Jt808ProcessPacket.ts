import Jt808ProcessPacketProps from "./Jt808ProcessPacketP1rops";

export type Jt808ProcessPacket = (props: Jt808ProcessPacketProps) => {
  updateLastActivity: boolean;
  imei: string;
};
