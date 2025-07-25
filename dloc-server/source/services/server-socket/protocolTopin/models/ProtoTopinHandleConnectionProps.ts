import { Persistence } from "../../../../models/Persistence";
import ProtoGt06HandlePacket from "./ProtoTopinHandlePacket";

export default interface ProtoTopinHandleConnectionProps {
  imei: string;
  remoteAddress: string;
  data: String;
  handlePacket: ProtoGt06HandlePacket;
  persistence: Persistence;
  counter: number;
  disconnect: () => void;
}
