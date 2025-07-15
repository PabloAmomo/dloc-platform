import { Persistence } from "../../../../models/Persistence";
import Proto1903HandlePacket from "./Proto1903HandlePacket";

export default interface Proto1903HandleConnectionProps {
  imei: string;
  remoteAddress: string;
  data: String;
  handlePacket: Proto1903HandlePacket;
  persistence: Persistence;
  counter: number;
  disconnect: () => void;
}
