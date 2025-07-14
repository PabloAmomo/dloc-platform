import byteArrayToHexString from "../../../../functions/byteArrayToHexString";
import numberToHexByteArray from "../../../../functions/numberToHexByteArray";
import  jt808CreateFrameData  from "./jt808CreateFrameData";

const jt808CreateTerminalRegistrationResponsePacket = (
  terminalId: string,
  counter: number,
  originalMsgSerialNumber: number,
) => {
  return jt808CreateFrameData({
    msgType: 0x8100,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(
      byteArrayToHexString(numberToHexByteArray(originalMsgSerialNumber)) +
        "00" + terminalId,
      "hex"
    ),
  });
};

export default jt808CreateTerminalRegistrationResponsePacket;
