import protoTopinGetBCDDateTimeUTC from "../../protocolTopin/functions/protoTopinGetBCDDateTimeUTC";
import { Jt808LocationPacket } from "../models/Jt808LocationPacket";
import jt808ParseAlarmBits from "./jt808ParseAlarmBits";
import jt808ParseStatusBits from "./jt808ParseStatusBits";

const jt808DecodeLocationReport = (data: Buffer): Jt808LocationPacket => {
  const alarm = data.readUInt32BE(0);
  const status = data.readUInt32BE(4);
  const lat = data.readUInt32BE(8) / 1e6;
  const lng = data.readUInt32BE(12) / 1e6;
  const altitude = data.readUInt16BE(16);
  const speed = data.readUInt16BE(18);
  const direction = data.readUInt16BE(20);

  const timeBCD = data.subarray(22, 28);
  const dateTimeUTC = protoTopinGetBCDDateTimeUTC(timeBCD).toISOString();
  
  const response = {
    dataType: 0,
    alarm,
    alarmFlags: jt808ParseAlarmBits(alarm),
    status,
    statusFlags: jt808ParseStatusBits(status),
    lat,
    lng,
    altitude,
    speed,
    direction,
    dateTimeUTC,
  };

  return response;
};

export default jt808DecodeLocationReport;
