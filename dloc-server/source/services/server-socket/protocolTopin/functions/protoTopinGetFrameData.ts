import { ProtoTopinPacket } from "../models/ProtoTopinPacket";

const protoTopinGetFrameData = (buffer: Buffer): ProtoTopinPacket => {
  if (
    buffer[0] !== 0x78 ||
    buffer[1] !== 0x78 ||
    buffer[buffer.length - 2] !== 0x0d ||
    buffer[buffer.length - 1] !== 0x0a
  )
    throw new Error("Invalid start or end delimiter");

  const packetData = buffer.slice(2, -2); // Exclude start and end delimiters
  const packetLength = packetData[0]; // First byte is the length

  if (packetData.length + 2 !== packetLength) // +2 for the end delimiter removed
    throw new Error(`Invalid packet length. Expected ${packetLength - 2} bytes, got ${packetData.length}`);

  const protocolNumber = packetData[1]; // Second byte is the protocol number
  const serialNumber = packetData[packetData.length - 1]; // Last byte is the serial number
  const informationContent = packetData.slice(2, -1); // Exclude protocol number

  console.log(`Protocol Number: ${protocolNumber}`);
  console.log(`Information Content: ${informationContent.toString("hex")}`);
  console.log(`Serial Number: ${serialNumber.toString(16)}`);
  
  /*
  if (buffer.length < 10) throw new Error("Packet too short to be valid");

  // 1. Start Bit (2 bytes)
  const startBit = buffer.slice(0, 2).toString("hex");

  // 2. Packet Length (1 byte)
  const packetLength = buffer[2];

  // Verificación básica de longitud esperada
  console.log(`Buffer content: ${buffer.toString("hex")}`);
  console.log(`Expected packet length: ${packetLength} bytes - lenght: ${buffer.length} bytes`);
  if (buffer.length !== packetLength + 2)
    throw new Error(`Invalid packet length. Expected ${packetLength + 2} bytes, got ${buffer.length}`);

  // 3. Protocol Number (1 byte)
  const protocolNumber = buffer[3];

  // 4. Information Content (N bytes)
  const infoContentEndIndex = 4 + (packetLength - 5); // subtract Protocol(1) + Serial(2) + CRC(2)
  const informationContent = buffer.slice(4, infoContentEndIndex);

  console.log(`Information Content: ${informationContent.toString("hex")}`);
  
  // 5. Information Serial Number (2 bytes)
  const serialNumber = buffer.readUInt16BE(infoContentEndIndex);

    console.log(`Serial Number: ${serialNumber.toString(16)}`);

  // 6. Error Check (1 bytes)
  const errorCheckBytes = buffer.slice(infoContentEndIndex + 2, infoContentEndIndex + 3);
  const errorCheck = errorCheckBytes.readUInt8(0);

  console.log(`Error Check: ${errorCheck.toString(8)}`);
  // const stopBit = buffer.slice(infoContentEndIndex + 4, infoContentEndIndex + 6).toString("hex");

  // ---- CRC VALIDATION ----
  const crcInput = buffer.slice(2, infoContentEndIndex + 2);
  const calculatedCRC = crc16ITU(crcInput);

  const isValid = calculatedCRC === errorCheck;

  if (!isValid) throw new Error(`CRC mismatch: expected ${errorCheck.toString(16)}, got ${calculatedCRC.toString(16)}`);
*/

  return {
    raw: buffer.toString("hex"),
    packetLength,
    protocolNumber,
    informationContent,
    serialNumber,
  };
};

export default protoTopinGetFrameData;

