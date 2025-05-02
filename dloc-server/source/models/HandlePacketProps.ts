import { Persistence } from "./Persistence";

export interface HandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: string;
  persistence: Persistence;
}

