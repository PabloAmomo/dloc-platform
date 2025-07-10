import { Persistence } from "./Persistence";

export interface HandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: string | Buffer;
  persistence: Persistence;
}

