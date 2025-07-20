import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";

const jt808CreateIntervalReportPacket = (
  terminalId: string,
  counter: number,
  intervalSec: number,
  movementMeters: number,
): Buffer => {
  /* Create interval report Packet */
  const intervalsPacket = jt808CreateParameterSettingPacket(terminalId, counter, [
    "00000020 01 " + createHexFromNumberWithNBytes(0, 2),           // report type (1 = timmming)

    "00000027 04 " + createHexFromNumberWithNBytes(intervalSec, 4), // Report time intervals during dormancy (seconds)
    "00000028 04 " + createHexFromNumberWithNBytes(intervalSec, 4), // Report time intervals during emergency alarm (seconds)
    "00000029 04 " + createHexFromNumberWithNBytes(intervalSec, 4), // Report time intervals when default (seconds)

    "0000002C 04 " + createHexFromNumberWithNBytes(movementMeters, 4), // Report distance intervals when default moving (meters)
    "0000002D 04 " + createHexFromNumberWithNBytes(movementMeters, 4), // Report distance intervals when moving during not login (meters)
    "0000002E 04 " + createHexFromNumberWithNBytes(movementMeters, 4), // Report distance intervals when moving during dormancy (meters)
    "0000002F 04 " + createHexFromNumberWithNBytes(movementMeters, 4), // Report distance intervals when moving during emergency (meters)
    //"00000031 04 " + createHexFromNumberWithNBytes(movementMeters, 4), // Geofence radius (meters)
  ]);

  return intervalsPacket;
};

export default jt808CreateIntervalReportPacket;


