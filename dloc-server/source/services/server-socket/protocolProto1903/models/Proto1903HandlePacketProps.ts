import { Persistence } from "../../../../models/Persistence";

export default interface Proto1903HandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: string;
  persistence: Persistence;
  counter: number;
  disconnect: () => void;
}

