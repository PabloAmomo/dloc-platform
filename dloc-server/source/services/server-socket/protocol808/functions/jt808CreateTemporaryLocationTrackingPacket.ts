import jt808CreateFrameData from "./jt808CreateFrameData";

// TODO: No funciona y no se porque
const jt808CreateTemporaryLocationTrackingPacket = (terminalId : string, counter : number, intervalSec: number, durationSec: number  ) : Buffer => {

  const bufInterval = Buffer.alloc(2);
  bufInterval.writeUInt16LE(intervalSec);

  const bufDuration = Buffer.alloc(4);
  bufDuration.writeUInt32LE(durationSec);

  const paramter1 = Buffer.concat([bufInterval, bufDuration]).toString('hex'); // 00 05 00 00 00 3C
  // const paramter1 = "00 05 00 00 00 3C".replace(/ /g, ""); 

  console.log(`-----------> check Location Tracking Controls: ${paramter1}`);
  const packet =  jt808CreateFrameData({
    msgType: 0x8202,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(paramter1, "hex"),
  });

  return packet;
}

export default jt808CreateTemporaryLocationTrackingPacket;