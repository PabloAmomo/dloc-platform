import jt808CreateFrameData from "./jt808CreateFrameData";

// TODO: No funciona y no se porque
const jt808CreateTemporaryLocationTrackingPacket = (terminalId : string, counter : number ) : Buffer => {

  const parametersCount = "03"; 
  const paramter1 = "002E 00FF"; 

  let paramList = parametersCount + paramter1;

  paramList = paramList.replace(/ /g, ""); // Remove spaces
  console.log(`-----------> check Location Tracking Controls: ${paramList}`);
  const packet =  jt808CreateFrameData({
    msgType: 0x8202,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(paramList, "hex"),
  });

  return packet;
}

export default jt808CreateTemporaryLocationTrackingPacket;