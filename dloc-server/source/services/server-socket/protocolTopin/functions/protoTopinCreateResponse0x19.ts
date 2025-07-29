import protoTopinCreatePacket from "./protoTopinCreatePacket";

const protoTopinCreateResponse0x19 = (datetime: Buffer): Buffer => {
  return protoTopinCreatePacket(Buffer.from([0x08, 0x19, ...datetime]));
}

export default protoTopinCreateResponse0x19;
