import { J808AlarmFlags } from "../services/server-socket/protocol808/functions/jt808ParseAlarmBits";
import { J808StatusFlags } from "../services/server-socket/protocol808/functions/jt808ParseStatusBits";

export type Jt808LocationPacket = {
  dataType: number;
  alarm: number;
  alarmFlags: J808AlarmFlags;
  status: number;
  statusFlags: J808StatusFlags;
  lat: number;
  lon: number;
  altitude: number;
  speed: number;
  direction: number;
  time: string;
  gsmSignal?: number;
  batteryPercent?: number;
  satellites?: number;
  aditionalStatusInfo?: Buffer;
  lbsInfo?: Buffer;
};
