import jt808CreateFrameData from "./jt808CreateFrameData";

const jt808CreateWakeupPacket = (terminalId: string, counter: number): Buffer => {
  return jt808CreateFrameData({
    msgType: 0x8145,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.alloc(0), // No body for this response
  });
};

export default jt808CreateWakeupPacket;
