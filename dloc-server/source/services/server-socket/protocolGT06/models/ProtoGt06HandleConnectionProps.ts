import { Persistence } from "../../../../models/Persistence";
import ProtoGt06HandlePacket from "./ProtoGt06HandlePacket";

export default interface ProtoGt06HandleConnectionProps {
  imei: string;
  remoteAddress: string;
  data: String;
  handlePacket: ProtoGt06HandlePacket;
  persistence: Persistence;
  counter: number;
  disconnect: () => void;
}
