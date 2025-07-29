import protoTopinCreatePacket from "./protoTopinCreatePacket";

// 0x44 stop data upload
const protoTopinCreatePacket0x44 = (): Buffer => {
   return protoTopinCreatePacket(Buffer.from([0x01, 0x44])); 
}

export default protoTopinCreatePacket0x44;
  