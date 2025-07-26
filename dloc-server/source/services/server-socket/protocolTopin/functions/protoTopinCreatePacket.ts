import crc16ITU from "../../../../functions/crc16ITU";

const protoTopinCreatePacket = (dataPayload: Buffer) => {
  // protocol + data + serial
  const packetLength = 2 + dataPayload.length + 2; // start + data(N) + end

  // Buffer to create the content
  const packet = Buffer.alloc(packetLength);
 
  if (dataPayload.length > 0) dataPayload.copy(packet, 2);

  packet[0] = 0x78;
  packet[1] = 0x78;

  packet[packet.length - 2] = 0x0d;
  packet[packet.length - 1] = 0x0a;

  return packet;
};

export default protoTopinCreatePacket;
