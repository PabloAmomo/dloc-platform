import { Persistence } from "../../../../models/Persistence";

export default interface Jt808HandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: Buffer;
  persistence: Persistence;
  counter: number;
  disconnect: () => void;
}
