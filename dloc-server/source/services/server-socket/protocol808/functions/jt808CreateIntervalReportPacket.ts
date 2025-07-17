import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";

const jt808CreateIntervalReportPacket = (
  terminalId: string,
  counter: number,
  intervalSec: number,
): Buffer => {

  /* Create interval report Packet */
  const intervalsPacket = jt808CreateParameterSettingPacket(
    terminalId,
    counter + 215,
    [
      "00000000 04 " + createHexFromNumberWithNBytes(intervalSec, 4), // Report by timming
      "00000027 04 " + createHexFromNumberWithNBytes(intervalSec, 4), // Report time intervals during dormancy (seconds)
      "00000028 04 " + createHexFromNumberWithNBytes(intervalSec, 4), // Report time intervals during emergency alarm (seconds)
      "00000029 04 " + createHexFromNumberWithNBytes(intervalSec, 4), // Report time intervals when default (seconds)
    ]
  );

  return intervalsPacket;
};

export default jt808CreateIntervalReportPacket;
