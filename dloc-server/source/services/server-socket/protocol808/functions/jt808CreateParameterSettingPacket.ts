import jt808CreateFrameData from "./jt808CreateFrameData";

// TODO: No funciona y no se porque
const jt808CreateParameterSettingPacket = (terminalId : string, counter : number ) : Buffer => {
  
  const parametersCount = "01"; 
  const paramter1 = "00000001 02 001E"; 

  let paramList = parametersCount + paramter1;

  paramList = paramList.replace(/ /g, "");
  const packet =  jt808CreateFrameData({
    msgType: 0x8103,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(paramList, "hex"),
  });

  return packet;
}

export default jt808CreateParameterSettingPacket;