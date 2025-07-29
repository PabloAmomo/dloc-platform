import Jt808ProcessPacketProps from "./Jt808ProcessPacketProps";

export type  Jt808ProcessPacket =  (props: Jt808ProcessPacketProps) => Promise<{
  updateLastActivity: boolean; 
  imei: string;
  mustDisconnect: boolean;
}>;
