import padNumberLeft from "../../../../functions/padNumberLeft";
import jt808CreateFrameData from "./jt808CreateFrameData";

const jt808CreateCheckParameterSettingPacket = (terminalId : string, counter : number, parameters: string[] ) : Buffer => {
 
  const paramList = padNumberLeft(parameters.length, 2, "0") + parameters.map(value => padNumberLeft(value, 8, "0")).join("").replace(/ /g, "");

  const packet =  jt808CreateFrameData({
    msgType: 0x8106,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(paramList, "hex"),
  });

  return packet;
}

export default jt808CreateCheckParameterSettingPacket;