import ProtoTopinProcessPacketProps from "./ProtoTopinProcessPacketProps";

export type  ProtoTopinProcessPacket =  (props: ProtoTopinProcessPacketProps) => Promise<{
  updateLastActivity: boolean; 
  imei: string;
  mustDisconnect: boolean;
}>;
