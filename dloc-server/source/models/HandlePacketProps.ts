import { Persistence } from "./Persistence";

export interface HandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: any; // TODO: Limit to Buffer or string type
  persistence: Persistence;
  counter: number;
}

