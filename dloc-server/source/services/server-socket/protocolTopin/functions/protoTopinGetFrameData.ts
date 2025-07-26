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

  if (packetLength !== 0 && packetData.length + 2 !== packetLength) // +2 for the end delimiter removed
    throw new Error(`Invalid packet length. Expected ${packetLength - 2} bytes, got ${packetData.length}`);

  const protocolNumber = packetData[1]; // Second byte is the protocol number
  const informationContent = packetData.slice(2); // Exclude protocol number

  console.log(`Protocol Number: ${protocolNumber}`);
  console.log(`Information Content: ${informationContent.toString("hex")}`);
  
  return {
    raw: buffer.toString("hex"),
    packetLength,
    protocolNumber,
    informationContent,
  };
};

export default protoTopinGetFrameData;

