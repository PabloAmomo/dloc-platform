import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import jt808CreateFrameData from "./jt808CreateFrameData";

const jt808CreateTemporaryLocationTrackingPacket = (
  terminalId: string,
  counter: number,
  intervalSec: number,
  durationSec: number
): Buffer => {
  // TODO: Quitar los comentarios y usar createHexFromNumberWithNBytes
  const bufInterval = createHexFromNumberWithNBytes(intervalSec, 2);
  //const bufInterval = Buffer.alloc(2);
  //bufInterval.writeUInt16BE(intervalSec);

  const bufDuration = createHexFromNumberWithNBytes(durationSec, 4);
  //const bufDuration = Buffer.alloc(4);
  //bufDuration.writeUInt32BE(durationSec);

  const paramter1 = bufInterval + bufDuration;
  // const paramter1 = Buffer.concat([bufInterval, bufDuration]).toString("hex");

  const packet = jt808CreateFrameData({
    msgType: 0x8202,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(paramter1, "hex"),
  });

  return packet;
};

export default jt808CreateTemporaryLocationTrackingPacket;
