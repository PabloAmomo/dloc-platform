import  jt808CreateFrameData  from "./jt808CreateFrameData";

const jt808CreateMessage = (
  terminalId: string,
  counter: number,
  msgType: number,
  body: Buffer | string | undefined = Buffer.alloc(0)
): Buffer => {
  if (typeof body === "string") {
    body = Buffer.from(body, "hex");
  } else if (!Buffer.isBuffer(body)) {
    body = Buffer.alloc(0);
  }
  return jt808CreateFrameData({
    msgType,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body, 
  });
};

export default jt808CreateMessage;
