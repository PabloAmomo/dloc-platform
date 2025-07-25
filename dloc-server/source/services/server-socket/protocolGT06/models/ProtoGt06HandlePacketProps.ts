import { Persistence } from "../../../../models/Persistence";

export default interface ProtoGt06HandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: string;
  persistence: Persistence;
  counter: number;
  disconnect: () => void;
}

