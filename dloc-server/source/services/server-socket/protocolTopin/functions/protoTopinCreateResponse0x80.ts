import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x80(TopinPacket: ProtoTopinPacket): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x02, 0x80])); 
}

export default protoTopinCreateResponse0x80;
