import { huabaoCreateFrameData } from "./huabaoCreateFrameData";

const huabaoCreateQueryLocationMessage = (
  terminalId: string,
  counter: number
): Buffer => {
  return huabaoCreateFrameData({
    msgType: 0x8201,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from("", "hex"),
  });
};

export default huabaoCreateQueryLocationMessage;
