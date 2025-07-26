import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0xB3(gt06Packer: ProtoTopinPacket): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x01, 0xB3])); // Response for protocol 0x01 with validation OK
}

export default protoTopinCreateResponse0xB3;
