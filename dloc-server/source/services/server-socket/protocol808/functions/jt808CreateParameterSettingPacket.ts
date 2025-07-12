import jt808CreateFrameData from "./jt808CreateFrameData";

const jt808CreateParameterSettingPacket = (terminalId : string, counter : number ) : Buffer => {

  // 
  const parametersCount = "01"; 
  const paramter1 = "0001 02 001E 0027 02 001E 0028 02 001E 0029 02 001E F117 02 0000 F111 01 01"; 

  let paramList = parametersCount + paramter1;

  paramList = paramList.replace(/ /g, ""); // Remove spaces
  console.log(`-----------> paramList: ${paramList}`);
  const packet =  jt808CreateFrameData({
    msgType: 0x8103,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(paramList, "hex"),
  });

  return packet;
}

export default jt808CreateParameterSettingPacket;