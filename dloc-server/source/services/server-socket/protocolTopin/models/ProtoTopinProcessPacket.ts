import ProtoGt06ProcessPacketProps from "./ProtoTopinProcessPacketProps";

export type  ProtoTopinProcessPacket =  (props: ProtoGt06ProcessPacketProps) => Promise<{
  updateLastActivity: boolean; 
  imei: string;
  mustDisconnect: boolean;
}>;
