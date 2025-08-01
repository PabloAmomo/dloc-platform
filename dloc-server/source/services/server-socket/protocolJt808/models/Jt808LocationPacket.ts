import { Jt808AlarmFlags } from "./Jt808AlarmFlags";
import { Jt808StatusFlags } from "./Jt808StatusFlags";

export type Jt808LocationPacket = {
  dataType: number;
  alarm: number;
  alarmFlags: Jt808AlarmFlags;
  status: number;
  statusFlags: Jt808StatusFlags;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  direction: number;
  dateTimeUTC: string;
  gsmSignal?: number;
  batteryLevel?: number;
  satellites?: number;
  aditionalStatusInfo?: Buffer;
  lbsInfo?: Buffer;
};
