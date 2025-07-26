import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0xB3(TopinPacket: ProtoTopinPacket): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x02, 0xB3])); 
}

export default protoTopinCreateResponse0xB3;
