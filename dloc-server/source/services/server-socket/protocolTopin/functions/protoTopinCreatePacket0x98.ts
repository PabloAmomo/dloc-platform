import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x98(interval: number): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x03, 0x98, 0x00, interval])); 
}

export default protoTopinCreateResponse0x98;
