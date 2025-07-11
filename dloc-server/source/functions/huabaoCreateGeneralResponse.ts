import byteArrayToHexString from "./byteArrayToHexString";
import { huabaoCreateFrameData } from "./huabaoCreateFrameData";
import numberToHexByteArray from "./numberToHexByteArray";
import toHexWith from "./toHexWith";

const huabaoCreateGeneralResponse = (
  terminalId: string,
  counter: number,
  originalMsgSerialNumber: number,
  msgType: number
) => {
  return huabaoCreateFrameData({
    msgType: 0x8001,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(
      byteArrayToHexString(numberToHexByteArray(originalMsgSerialNumber)) +
        toHexWith(msgType, 4) +
        "00",
      "hex"
    ),
  });
};

export default huabaoCreateGeneralResponse;
