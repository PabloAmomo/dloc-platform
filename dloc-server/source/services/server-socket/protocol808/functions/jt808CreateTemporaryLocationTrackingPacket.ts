import jt808CreateFrameData from "./jt808CreateFrameData";

// TODO: No funciona y no se porque
const jt808CreateTemporaryLocationTrackingPacket = (terminalId : string, counter : number ) : Buffer => {

  const paramter1 = "00 05 00 00 00 3C".replace(/ /g, ""); 

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