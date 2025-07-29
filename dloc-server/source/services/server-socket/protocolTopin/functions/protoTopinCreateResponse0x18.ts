import protoTopinCreatePacket from "./protoTopinCreatePacket";

const protoTopinCreateResponse0x18 = (datetime: Buffer): Buffer => {
  return protoTopinCreatePacket(Buffer.from([0x08, 0x18, ...datetime]));
}

export default protoTopinCreateResponse0x18;
