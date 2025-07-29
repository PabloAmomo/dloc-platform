import { Persistence } from "../../../../models/Persistence";
import ProtoTopinHandlePacket from "./ProtoTopinHandlePacket";

export default interface ProtoTopinHandleConnectionProps {
  imei: string;
  remoteAddress: string;
  data: String;
  handlePacket: ProtoTopinHandlePacket;
  persistence: Persistence;
  counter: number;
  disconnect: () => void;
}
