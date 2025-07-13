import { Persistence } from "./Persistence";

export interface HandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: Buffer | String; 
  persistence: Persistence;
  counter: number;
}

