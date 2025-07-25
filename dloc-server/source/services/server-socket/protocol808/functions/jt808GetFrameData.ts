import { Jt808Packet } from "../models/Jt808Packet";

const jt808GetFrameData = (buffer: Buffer): Jt808Packet => {
  if (buffer[0] !== 0x7e || buffer[buffer.length - 1] !== 0x7e) throw new Error("Invalid start or end delimiter");

  const content = buffer.slice(1, buffer.length - 2); // Excluye delimitadores y checksum
  const checksum = buffer[buffer.length - 2];

  const msgId = content.readUInt16BE(0);
  const msgProp = content.readUInt16BE(2);

  const terminalId = content.slice(4, 10).toString("hex");
  const msgSerialNumber = content.readUInt16BE(10);

  const isSegmented = (msgProp & 0x2000) !== 0;
  const encryptionType = (msgProp >> 10) & 0x07;
  const bodyLength = msgProp & 0x03ff;

  let packetInfo = null;
  let bodyStart = 12;

  if (isSegmented) {
    packetInfo = {
      totalPackets: content.readUInt16BE(12),
      packetIndex: content.readUInt16BE(14),
    };
    bodyStart += 4;
  }

  const body = content.slice(bodyStart);

  const calculatedChecksum = content.reduce((sum, byte) => sum ^ byte, 0);
  const isChecksumValid = calculatedChecksum === checksum;

  return {
    raw: buffer.toString("hex"),
    header: {
      msgType: msgId,
      msgProp,
      bodyLength,
      isSegmented,
      encryptionType,
      terminalId,
      msgSerialNumber,
      packetInfo,
    },
    body,
    checksum: {
      value: checksum,
      valid: isChecksumValid,
    },
  };
};

export default jt808GetFrameData;
