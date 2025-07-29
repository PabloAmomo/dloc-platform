import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreatePacket0x80(): Buffer {
  // Instant Update WIFI / GPS / LBS : 0x01, 0x80
  // Instant Update WIFI / LBS       : 0x02, 0x80
  return protoTopinCreatePacket(Buffer.from([0x01, 0x80]));
}

export default protoTopinCreatePacket0x80;
