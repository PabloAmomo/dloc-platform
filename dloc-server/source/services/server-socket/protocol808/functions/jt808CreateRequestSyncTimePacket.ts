import convertByteArrayToHexString from "../../../../functions/convertByteArrayToHexString";
import convertNumberToHexByteArray from "../../../../functions/convertNumberToHexByteArray";
import toHexWith from "../../../../functions/toHexWith";
import jt808CreateFrameData from "./jt808CreateFrameData";
import jt808TimeSyncBody from "./jt808TimeSyncBody";

const jt808CreateRequestSyncTimePacket = (
  imei: string,
  counter: number,
  msgSerialNumber: number
): Buffer => {
  return jt808CreateFrameData({
    msgType: 0x8109,
    terminalId: Buffer.from(imei, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(
      convertByteArrayToHexString(convertNumberToHexByteArray(msgSerialNumber)) +
        toHexWith(0x0109, 4) +
        jt808TimeSyncBody().toString("hex"),
      "hex"
    ),
  });
};

export default jt808CreateRequestSyncTimePacket;
