import crc16ITU from "../../../../functions/crc16ITU";
import { ProtoGt06Packet } from "../models/ProtoGt06Packet";

const protoGt06GetFrameData = (buffer: Buffer): ProtoGt06Packet => {
  if (
    buffer[0] !== 0x78 ||
    buffer[1] !== 0x78 ||
    buffer[buffer.length - 2] !== 0x0d ||
    buffer[buffer.length - 1] !== 0x0a
  )
    throw new Error("Invalid start or end delimiter");

  if (buffer.length < 10) throw new Error("Packet too short to be valid");

  // 1. Start Bit (2 bytes)
  const startBit = buffer.slice(0, 2).toString("hex");

  // 2. Packet Length (1 byte)
  const packetLength = buffer[2];

  // Verificación básica de longitud esperada
  if (buffer.length !== packetLength + 2)
    throw new Error(`Invalid packet length. Expected ${packetLength + 2} bytes, got ${buffer.length}`);

  // 3. Protocol Number (1 byte)
  const protocolNumber = buffer[3];

  // 4. Information Content (N bytes)
  const infoContentEndIndex = 4 + (packetLength - 5); // subtract Protocol(1) + Serial(2) + CRC(2)
  const informationContent = buffer.slice(4, infoContentEndIndex);

  // 5. Information Serial Number (2 bytes)
  const serialNumber = buffer.readUInt16BE(infoContentEndIndex);

  // 6. Error Check (2 bytes)
  const errorCheckBytes = buffer.slice(infoContentEndIndex + 2, infoContentEndIndex + 4);
  const errorCheck = errorCheckBytes.readUInt16BE(0);

  const stopBit = buffer.slice(infoContentEndIndex + 4, infoContentEndIndex + 6).toString("hex");

  // ---- CRC VALIDATION ----
  const crcInput = buffer.slice(2, infoContentEndIndex + 2);
  const calculatedCRC = crc16ITU(crcInput);

  const isValid = calculatedCRC === errorCheck;

  if (!isValid) throw new Error(`CRC mismatch: expected ${errorCheck.toString(16)}, got ${calculatedCRC.toString(16)}`);

  return {
    raw: buffer.toString("hex"),
    packetLength,
    protocolNumber,
    informationContent,
    serialNumber,
  };
};

export default protoGt06GetFrameData;
