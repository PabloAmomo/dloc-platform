import convertAnyToHexString from "../../../../functions/convertAnyToHexString";
import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import { printMessage } from "../../../../functions/printMessage";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";

const jt808CreateReportIntervalsParameters = (
  terminalId: string,
  counter: number,
  uploadSec: number,
  prefix: string,
  response: Buffer[]
) => {
  const powerPackerSettingsX027 = jt808CreateParameterSettingPacket(
    terminalId,
    counter + 201,
    [
      "00000027 04 " + createHexFromNumberWithNBytes(uploadSec, 4), // Report time intervals during dormancy, unit second
    ]
  );
  printMessage(
    `${prefix} 🔋 Power config Packet sent (0x0027): ${convertAnyToHexString(
      powerPackerSettingsX027
    )}`
  );
  response.push(powerPackerSettingsX027);

  const powerPackerSettingsX028 = jt808CreateParameterSettingPacket(
    terminalId,
    counter + 202,
    [
      "00000028 04 " + createHexFromNumberWithNBytes(uploadSec, 4), // Report time intervals during alarm, unit second
    ]
  );
  printMessage(
    `${prefix} 🔋 Power config Packet sent (0x0027): ${convertAnyToHexString(
      powerPackerSettingsX028
    )}`
  );
  response.push(powerPackerSettingsX028);

  const powerPackerSettingsX029 = jt808CreateParameterSettingPacket(
    terminalId,
    counter + 203,
    [
      "00000029 04 " + createHexFromNumberWithNBytes(uploadSec, 4), // Report time intervals during normal, unit second
    ]
  );
  printMessage(
    `${prefix} 🔋 Power config Packet sent (0x0029): ${convertAnyToHexString(
      powerPackerSettingsX029
    )}`
  );
  response.push(powerPackerSettingsX029);
};

export default jt808CreateReportIntervalsParameters;
