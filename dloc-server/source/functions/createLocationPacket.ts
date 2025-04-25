import { Direction } from '../models/Direction';
import { PositionPacket } from '../models/PositionPacket';
import { parseLatOrLng } from './parseLatOrLng';
import { parseUtcDateTime } from './parseUtcDateTime';
import { printMessage } from './printMessage';

const createLocationPacket = (imei: string, remoteAdd: string, values: string[]): PositionPacket | undefined => {
  try {
    return {
      imei,
      remoteAddress: remoteAdd,
      dateTimeUtc: parseUtcDateTime(values[2], values[9]),
      valid: (values[3] ?? '').toUpperCase().trim() === 'A',
      lat: parseLatOrLng(values[4], values[5] as Direction),
      lng: parseLatOrLng(values[6], values[7] as Direction),
      // latRaw: values[4],
      // latRawDirection: values[5] as Direction,
      // lngRaw: values[6],
      // lngRawDirection: values[7] as Direction,
      speed: parseInt(values[8] ?? '0'),
      directionAngle: parseInt(values[10] ?? '0'),
      gsmSignal: parseInt(values[11] ?? '0'),
      // numberOfSatelites: parseInt(values[12] ?? '0'),
      batteryLevel: parseInt(values[13] ?? '0'),
      // ACCStatus: values[14],
      // defenseStatus: values[15],
      // workingStatus: values[16],
      // oilSwitch: values[17],
      // electricSwitch: values[18],
      // assemblyState: values[19],
      // alarmFlags: values[20],
      // voiceControlRecording: values[21],
      // // LBS info
      // MCCCountryCode: values?.[22],
      // MNC: values?.[23],
      // lAC: values?.[24],
      // cID: values?.[25],
      // // Wifi
      // wifi: values?.[26] ?? '',
    };
  } catch (err: Error | any) {
    printMessage(`[${imei}] (${remoteAdd}) error updating device [${err.message}]`);
    return undefined;
  }
};

export { createLocationPacket };
