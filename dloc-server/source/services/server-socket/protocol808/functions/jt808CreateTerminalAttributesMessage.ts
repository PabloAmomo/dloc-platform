import  jt808CreateFrameData  from "./jt808CreateFrameData";

const jt808CreateTerminalAttributesMessage = (
  terminalId: string,
  counter: number
): Buffer => {
  return jt808CreateFrameData({
    msgType: 0x8107,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.alloc(0), 
  });
};

export default jt808CreateTerminalAttributesMessage;
