import toHexWith from "../../../../functions/toHexWith";
import byteArrayToHexString from "../../../../functions/byteArrayToHexString";
import numberToHexByteArray from "../../../../functions/numberToHexByteArray";
import  jt808CreateFrameData  from "./jt808CreateFrameData";

const jt808CreateGeneralResponse = (
  terminalId: string,
  counter: number,
  originalMsgSerialNumber: number,
  msgType: number,
  response: string
) => {
  return jt808CreateFrameData({
    msgType: 0x8001,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(
      byteArrayToHexString(numberToHexByteArray(originalMsgSerialNumber)) +
        toHexWith(msgType, 4) +
        response,
      "hex"
    ),
  });
};

export default jt808CreateGeneralResponse;
