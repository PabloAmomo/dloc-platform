import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import { printMessage } from "../../../../functions/printMessage";
import jt808CreateFrameData from "./jt808CreateFrameData";

const jt808CreateTemporaryLocationTrackingPacket = (
  terminalId: string,
  counter: number,
  intervalSec: number,
  durationSec: number,
  prefix: string
): Buffer => {
  const bufInterval = createHexFromNumberWithNBytes(intervalSec, 2);
  const bufDuration = createHexFromNumberWithNBytes(durationSec, 4);
  const paramter1 = bufInterval + bufDuration;

  printMessage(
    intervalSec === 0 && durationSec === 0
      ? `${prefix} 📡 Temporary Location Tracking: 🧹 Clean Tracking [${counter}]`
      : `${prefix} 📡 Temporary Location Tracking: ⏰ Interval: ${intervalSec} sec, Duration: ${durationSec} sec [${counter}]`
  );

  const packet = jt808CreateFrameData({
    msgType: 0x8202,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body: Buffer.from(paramter1, "hex"),
  });

  return packet;
};

export default jt808CreateTemporaryLocationTrackingPacket;
