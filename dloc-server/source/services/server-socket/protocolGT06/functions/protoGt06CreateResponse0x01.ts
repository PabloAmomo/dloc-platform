import { ProtoGt06Packet } from "../models/ProtoGt06Packet";
import protoGt06CreatePacket from "./protoGt06CreatePacket";

function protoGt06CreateResponse0x01(gt06Packer: ProtoGt06Packet): Buffer {
  // If you want to return a Buffer with these values:
  return Buffer.from([0x78, 0x78, 0x05, 0x01, 0x28, 0x0D, 0x0A]);
  // Or, if you want to use protoGt06CreatePacket, uncomment the following line and remove the above return:
  // return protoGt06CreatePacket(gt06Packer.protocolNumber, gt06Packer.serialNumber, Buffer.alloc(0));
}

export default protoGt06CreateResponse0x01;
