import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x97(interval: number): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x04, 0x97, 0x00, interval])); 
}

export default protoTopinCreateResponse0x97;
