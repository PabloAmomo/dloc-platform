import { printMessage } from "../../../../functions/printMessage";
import { Jt808ParamametersParameter, Jt808ParamametersSettings, Jt808ParamametersSettingsResponse } from '../models/Jt808ParamametersSettingsResponse';

const jt808ParseParamentersSettings = (
  imei: string,
  remoteAddress: string,
  buf: Buffer
): Jt808ParamametersSettingsResponse => {
  const parameters: Jt808ParamametersParameter[] = [];
  const paramatersSettings: Jt808ParamametersSettings = {};

  const emptyResponse: Jt808ParamametersSettingsResponse = {
    responseSerial: 0,
    parameterCount: 0,
    parameters: [],
    paramatersSettings: {},
  };

  if (buf.length < 3) {
    printMessage(
      `[${imei}] (${remoteAddress}) ❌ Buffer too short to contain header`
    );
    return emptyResponse;
  }

  const responseSerial = buf.readUInt16BE(0);
  const parameterCount = buf.readUInt8(2);

  let offset = 3;

  for (let i = 0; i < parameterCount; i++) {
    if (offset + 5 > buf.length) {
      printMessage(
        `[${imei}] (${remoteAddress}) ❌ Unexpected end of buffer while parsing parameter ${
          i + 1
        }`
      );
      return emptyResponse;
    }

    const id = buf.readUInt32BE(offset);
    const length = buf.readUInt8(offset + 4);
    offset += 5;

    if (offset + length > buf.length) {
      printMessage(
        `[${imei}] (${remoteAddress}) ❌ Parameter ${id} claims length ${length} but not enough data remains`
      );
      return emptyResponse;
    }

    const value = buf.subarray(offset, offset + length);
    offset += length;

    if (id === 0x0001)
      paramatersSettings.heartbeat = {
        value: value.readUInt32BE(0), // Heartbeat interval in seconds
      };
    else if (id === 0xf118)
      paramatersSettings.batteryLevel = {
        value: value.readUInt8(0), // Battery level percentage (0-100)
      };
    else if (id === 0xf142)
      paramatersSettings.timeZone = {
        value: value.readUInt8(0), // Time zone offset value
      };

    parameters.push({ id, length, value });
  }

  return {
    responseSerial,
    parameterCount,
    parameters,
    paramatersSettings,
  };
};

export default jt808ParseParamentersSettings;
