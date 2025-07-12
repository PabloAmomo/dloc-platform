import jt808CreateFrameData from "./jt808CreateFrameData";

const jt808CreateCheckParameterPacket = (terminalId : string, counter : number ) : Buffer => {

  const parametersCount = "02"; 
  const paramter1 = "0001 0002"; 

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