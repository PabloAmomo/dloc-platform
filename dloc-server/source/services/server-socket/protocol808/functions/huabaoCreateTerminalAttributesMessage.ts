import { huabaoCreateFrameData } from "./huabaoCreateFrameData";

const huabaoCreateTerminalAttributesMessage = (
  terminalId: string,
  counter: number
): Buffer => {
  return huabaoCreateFrameData({
    msgType: 0x8107,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from("", "hex"),
  });
};

export default huabaoCreateTerminalAttributesMessage;
