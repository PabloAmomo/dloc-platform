import Jt808ProcessPacketProps from "./Jt808ProcessPacketPropss";

export type Jt808ProcessPacket = (props: Jt808ProcessPacketProps) => {
  updateLastActivity: boolean;
  imei: string;
};
