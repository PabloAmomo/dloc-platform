import crc16ITU from "../../../../functions/crc16ITU";

const protoGt06CreatePacket = (protocolNumber: number, serialNumber: number, dataPayload: Buffer) => {
  // protocol + data + serial
  const contentLength = 1 + dataPayload.length + 2; // proto(1) + data(N) + serial(2)

  // Buffer to create the content
  const content = Buffer.alloc(contentLength);

  content[0] = protocolNumber;
 
  if (dataPayload.length > 0) dataPayload.copy(content, 1);
 
  // copiar datos a partir de índice 1
  content.writeUInt16BE(serialNumber, 1 + dataPayload.length); // serial al final

  // Longitud total del campo [proto + data + serial]
  const packetLength = content.length;

  // Armar cabecera completa: start bit (2), length (1), contenido, CRC (2), stop bit (2)
  const packet = Buffer.alloc(2 + 1 + content.length + 2 + 2);

  // Start bit
  packet[0] = 0x78;
  packet[1] = 0x78;

  // Length
  packet[2] = packetLength;

  // Copiar contenido (proto + data + serial)
  content.copy(packet, 3);

  // Calcular CRC desde "Length" hasta "Serial Number"
  const crc = crc16ITU(packet.slice(2, 3 + content.length));
  packet.writeUInt16BE(crc, 3 + content.length);

  // Stop bits
  packet[3 + content.length + 2] = 0x0d;
  packet[3 + content.length + 3] = 0x0a;

  return packet;
};

export default protoGt06CreatePacket;
