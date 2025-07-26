import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x01(TopinPacket: ProtoTopinPacket): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x01, 0x01])); // Response for protocol 0x01 with validation OK
}

export default protoTopinCreateResponse0x01;
