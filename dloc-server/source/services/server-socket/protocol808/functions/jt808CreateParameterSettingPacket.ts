import jt808CreateFrameData from "./jt808CreateFrameData";

const jt808CreateParameterSettingPacket = (terminalId : string, counter : number ) : Buffer => {

  // 
  const parametersCount = "06"; 
  const paramter1 = "00000001 02 001E 00000027 02 001E 00000028 02 001E 00000029 02 001E 0000F117 02 0000 0000F111 01 01"; 

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