import { Persistence } from "../../../../models/Persistence";

export interface Jt808HandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: Buffer;
  persistence: Persistence;
  counter: number;
}
