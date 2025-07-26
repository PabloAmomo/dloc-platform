import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x13(intervalTimeMin: number): Buffer {
  return protoTopinCreatePacket(Buffer.from([
    0x03, 
    0x13, 
    intervalTimeMin, 
  ])); 
}

export default protoTopinCreateResponse0x13;
