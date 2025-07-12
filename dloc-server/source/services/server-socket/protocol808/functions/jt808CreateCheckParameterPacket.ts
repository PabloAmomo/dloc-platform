import jt808CreateFrameData from "./jt808CreateFrameData";

// TODO: No funciona y no se porque
const jt808CreateCheckParameterPacket = (terminalId : string, counter : number ) : Buffer => {

  const parametersCount = "03"; 
  const paramter1 = "0001 0013 0018"; 

  let paramList = parametersCount + paramter1;

  paramList = paramList.replace(/ /g, ""); // Remove spaces
  console.log(`-----------> check aramList: ${paramList}`);
  const packet =  jt808CreateFrameData({
    msgType: 0x8106,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(paramList, "hex"),
  });

  return packet;
}

export default jt808CreateCheckParameterPacket;