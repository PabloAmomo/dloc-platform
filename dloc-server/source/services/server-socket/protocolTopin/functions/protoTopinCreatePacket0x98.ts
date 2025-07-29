import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreatePacket0x98(intervalSec: number): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x03, 0x98, 0x00, intervalSec])); 
}

export default protoTopinCreatePacket0x98;
