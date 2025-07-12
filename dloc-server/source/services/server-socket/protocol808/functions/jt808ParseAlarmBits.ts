import { Jt808AlarmFlags } from "../../../../models/Jt808AlarmFlags";

const jt808ParseAlarmBits = (alarmInt: number): Jt808AlarmFlags => {
  return {
    emergency: (alarmInt & (1 << 0)) !== 0,
    overspeed: (alarmInt & (1 << 1)) !== 0,
    drivingMalfunction: (alarmInt & (1 << 2)) !== 0,
    gnssAntennaDisconnected: (alarmInt & (1 << 5)) !== 0,
    gnssAntennaShortCircuited: (alarmInt & (1 << 6)) !== 0,
    lowBattery: (alarmInt & (1 << 7)) !== 0,
    powerCut: (alarmInt & (1 << 8)) !== 0,
    accumulatedOverspeed: (alarmInt & (1 << 18)) !== 0,
    timeoutParking: (alarmInt & (1 << 19)) !== 0,
    illegalIgnition: (alarmInt & (1 << 27)) !== 0,
    illegalDisplacement: (alarmInt & (1 << 28)) !== 0,
  };
}

export default jt808ParseAlarmBits;