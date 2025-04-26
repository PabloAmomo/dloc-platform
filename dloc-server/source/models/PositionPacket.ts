import { GpsAccuracy } from "./GpsAccuracy";


export interface PositionPacket {
  imei: string;
  remoteAddress: string;
  dateTimeUtc: Date | null;
  valid: boolean;
  lat: number | null;
  lng: number | null;
  // latRaw: string,
  // latRawDirection: Direction,
  // lngRaw: string,
  // lngRawDirection: Direction,
  speed: number;
  directionAngle: number;
  gsmSignal: number;
  // numberOfSatelites: number
  batteryLevel: number;
  accuracy: GpsAccuracy;
  activity: string;
  // // OTHERS
  // ACCStatus: any;
  // defenseStatus: any;
  // workingStatus: any;
  // oilSwitch: any;
  // electricSwitch: any;
  // assemblyState: any;
  // alarmFlags: any;
  // voiceControlRecording: any;
  // // LBS info
  // MCCCountryCode: any;
  // MNC: any;
  // lAC: any;
  // cID: any;
  // Wifi
  // wifi: string;
}