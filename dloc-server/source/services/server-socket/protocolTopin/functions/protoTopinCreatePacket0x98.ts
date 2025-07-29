import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x98(intervalSec: number): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x03, 0x98, 0x00, intervalSec])); 
}

export default protoTopinCreateResponse0x98;
