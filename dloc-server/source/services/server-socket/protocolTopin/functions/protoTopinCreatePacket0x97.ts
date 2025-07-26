import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x97(intervalSec: number): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x03, 0x97, 0x00, intervalSec])); 
}

export default protoTopinCreateResponse0x97;
