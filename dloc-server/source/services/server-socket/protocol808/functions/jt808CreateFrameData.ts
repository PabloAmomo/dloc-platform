const jt808CreateFrameData = (options: {
  msgType: number; // tipo de mensaje (2 bytes)
  terminalId: Buffer; // ID del dispositivo (6 o 7 bytes)
  msgSerialNumber: number; // índice de mensaje (1 o 2 bytes)
  body: Buffer ; // cuerpo del mensaje
}): Buffer => {
  const { msgType, terminalId, msgSerialNumber, body } = options;

  const delimiter = 0x7e;

  // El tipo de mensaje define si index es 1 o 2 bytes
  const indexIsShort = msgType !== 0x0200 && msgType !== 0x0211;
  const indexLength = indexIsShort ? 2 : 1;

  // Calculamos el atributo automáticamente
  const bodyLength = body.length;
  const attribute = bodyLength & 0x01ff; // 9 bits (máscara binaria 0000000111111111)

  // Calculamos tamaño total: header + body + checksum
  const headerLength = 1 + 2 + 2 + terminalId.length + indexLength;
  const totalLength = headerLength + bodyLength + 1 + 1; // (1 byte de checksum + 1 byte de delimitador final)

  const buffer = Buffer.alloc(totalLength);
  let offset = 0;

  buffer.writeUInt8(delimiter, offset++);
  buffer.writeUInt16BE(msgType, offset);
  offset += 2;
  buffer.writeUInt16BE(attribute, offset);
  offset += 2;
  terminalId.copy(buffer, offset);
  offset += terminalId.length;

  buffer.writeUInt16BE(msgSerialNumber, offset);
  offset += 2;

  if (bodyLength > 0) {
    body.copy(buffer, offset);
    offset += bodyLength;
  }

  // Calculate checksum excluding the first byte (delimiter) and the last byte (checksum itself)
  const checksum = buffer.slice(1).reduce((sum, byte) => sum ^ byte, 0);

  buffer.writeUInt8(checksum, offset);

  buffer.writeUInt8(delimiter, offset + 1); // Delimitador final

  return buffer;
};

export default jt808CreateFrameData;
