function xorChecksum(buffer: Buffer): number {
  let checksum = 0;
  for (let i = 0; i < buffer.length; i++) {
    checksum ^= buffer[i];
  }
  return checksum;
}

const huabaoFormatMessage = (
  delimiter: number,
  type: number,
  id: Buffer,
  shortIndex: boolean,
  data: Buffer
): Buffer => {
  const headerLength = 1 + 2 + 2 + id.length + (shortIndex ? 1 : 2);
  const totalLength = headerLength + data.length + 1 + 1; // data + checksum + end delimiter

  const buffer = Buffer.alloc(totalLength);
  let offset = 0;

  buffer.writeUInt8(delimiter, offset); offset += 1;
  buffer.writeUInt16BE(type, offset); offset += 2;
  buffer.writeUInt16BE(data.length, offset); offset += 2;

  id.copy(buffer, offset); offset += id.length;

  if (shortIndex) {
    buffer.writeUInt8(1, offset); offset += 1;
  } else {
    buffer.writeUInt16BE(0, offset); offset += 2;
  }

  data.copy(buffer, offset); offset += data.length;

  // Checksum from everything except first byte (delimiter) and last (which we add after)
  const checksum = xorChecksum(buffer.slice(1, offset));
  buffer.writeUInt8(checksum, offset); offset += 1;

  buffer.writeUInt8(delimiter, offset); // End delimiter

  return buffer;
}

export default huabaoFormatMessage;