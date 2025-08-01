import { Jt808CommonTerminalResponse } from "../models/Jt808CommonTerminalResponse";

const jt808ParseCommonResultFromTerminal = (
  buf: Buffer
): Jt808CommonTerminalResponse => {
  if (buf.length < 5) {
    return {
      responseToMsgSerialNumber: 0,
      msgSerialNumber: 0,
      result: "unknown",
    };
  }

  const responseToMsgSerialNumber = buf.readUInt16BE(0);
  const msgSerialNumber = buf.readUInt16BE(2);
  const resultCode = buf.readUInt8(4);

  let result: Jt808CommonTerminalResponse["result"];
  switch (resultCode) {
    case 0x00:
      result = "success";
      break;
    case 0x01:
      result = "failure";
      break;
    case 0x02:
      result = "incorrect";
      break;
    case 0x03:
      result = "not_supported";
      break;
    default:
      result = "unknown";
  }

  return {
    responseToMsgSerialNumber,
    msgSerialNumber,
    result,
  };
};

export default jt808ParseCommonResultFromTerminal;
