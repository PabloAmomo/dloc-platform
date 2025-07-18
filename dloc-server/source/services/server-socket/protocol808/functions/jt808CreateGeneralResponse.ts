import toHexWith from "../../../../functions/toHexWith";
import convertByteArrayToHexString from "../../../../functions/convertByteArrayToHexString";
import convertNumberToHexByteArray from "../../../../functions/convertNumberToHexByteArray";
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
      convertByteArrayToHexString(convertNumberToHexByteArray(originalMsgSerialNumber)) +
        toHexWith(msgType, 4) +
        response,
      "hex"
    ),
  });
};

export default jt808CreateGeneralResponse;
