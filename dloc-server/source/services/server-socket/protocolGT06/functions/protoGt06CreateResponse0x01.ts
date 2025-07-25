import { ProtoGt06Packet } from "../models/ProtoGt06Packet";
import protoGt06CreatePacket from "./protoGt06CreatePacket";

function protoGt06CreateResponse0x01(gt06Packer: ProtoGt06Packet): Buffer {
  return protoGt06CreatePacket(gt06Packer.protocolNumber, gt06Packer.serialNumber, Buffer.alloc(0));
}

export default protoGt06CreateResponse0x01;
