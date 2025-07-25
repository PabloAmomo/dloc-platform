import { ProtoGt06Packet } from "../models/ProtoGt06Packet";

const protoGt06GetFrameData = (buffer: Buffer): ProtoGt06Packet  => {

    if (buffer[0] !== 0x7E || buffer[buffer.length - 1] !== 0x7E) {
    throw new Error('Invalid start or end delimiter');
  }

  const content = buffer.slice(1, buffer.length - 2); // Excluye delimitadores y checksum
  const checksum = buffer[buffer.length - 2];

  const msgId = content.readUInt16BE(0);
  
  const terminalId = content.slice(2, 2).toString('hex');
    
  let bodyStart = 4;

  
  const body = content.slice(bodyStart);

  const calculatedChecksum = content.reduce((sum, byte) => sum ^ byte, 0);
  const isChecksumValid = calculatedChecksum === checksum;

  return {
    raw: buffer.toString('hex'),
    header: {
      msgType: msgId,
      terminalId,
    },
    body,
    checksum: {
      value: checksum,
      valid: isChecksumValid,
    },
  };
}

export default protoGt06GetFrameData;