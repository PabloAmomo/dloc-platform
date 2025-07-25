import ProtoGt06ProcessPacketProps from "./ProtoGt06ProcessPacketProps";

export type  ProtoGt06ProcessPacket =  (props: ProtoGt06ProcessPacketProps) => Promise<{
  updateLastActivity: boolean; 
  imei: string;
  mustDisconnect: boolean;
}>;
