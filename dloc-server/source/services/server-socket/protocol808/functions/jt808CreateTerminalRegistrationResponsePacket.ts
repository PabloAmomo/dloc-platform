import convertByteArrayToHexString from "../../../../functions/convertByteArrayToHexString";
import convertNumberToHexByteArray from "../../../../functions/convertNumberToHexByteArray";
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
      convertByteArrayToHexString(convertNumberToHexByteArray(originalMsgSerialNumber)) +
        "00" + terminalId,
      "hex"
    ),
  });
};

export default jt808CreateTerminalRegistrationResponsePacket;
