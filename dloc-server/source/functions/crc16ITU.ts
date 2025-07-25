// ---- CRC-ITU (CRC-16-IBM) Implementation ----
const crc16ITU = (buffer : Buffer): number => {
  let crc = 0x0000;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= (buffer[i] << 8);
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF; // Keep 16-bit
    }
  }
  return crc;
}

export default crc16ITU;