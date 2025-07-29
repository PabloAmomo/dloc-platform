import protoTopinCreatePacket from "./protoTopinCreatePacket";

// 0x33 prohibits LBS positioning
function protoTopinCreatePacket0x33(state: boolean): Buffer {
  return protoTopinCreatePacket(Buffer.from([0x02, 0x33, state ? 0x01 : 0x00])); 
}

export default protoTopinCreatePacket0x33;
