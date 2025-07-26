import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreatePacket0x61(state: boolean): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x02, 0x61, state ? 0x01 : 0x00])); 
}

export default protoTopinCreatePacket0x61;
