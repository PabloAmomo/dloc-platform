import { ProtoTopinPacket } from "../models/ProtoTopinPacket";

function protoTopinCreateResponse0x01(gt06Packer: ProtoTopinPacket): Buffer {
  // Validation OK
  return Buffer.from([0x78, 0x78, 0x01, 0x1, 0x0D, 0x0A]);
}

export default protoTopinCreateResponse0x01;
