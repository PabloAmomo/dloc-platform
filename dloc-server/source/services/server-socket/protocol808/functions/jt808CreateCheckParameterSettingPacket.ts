import padNumberLeft from "../../../../functions/padNumberLeft";
import jt808CreateFrameData from "./jt808CreateFrameData";

const jt808CreateCheckParameterSettingPacket = (
  terminalId: string,
  counter: number,
  parameters: string[]
): Buffer => {
  const paramList =
    padNumberLeft(parameters.length, 2, "0") +
    parameters
      .map((value) => padNumberLeft(value, 8, "0"))
      .join("")
      .replace(/ /g, "");

  if (paramList.length === 0) {
  }

  const packet = jt808CreateFrameData({
    msgType: paramList.length === 0 ? 0x8104 : 0x8106,
    terminalId: Buffer.from(terminalId, "hex"),
    msgSerialNumber: counter,
    body:
      paramList.length === 0 ? Buffer.alloc(0) : Buffer.from(paramList, "hex"),
  });

  return packet;
};

export default jt808CreateCheckParameterSettingPacket;
