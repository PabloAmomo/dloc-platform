import { Jt808AlarmFlags } from "../models/Jt808AlarmFlags";

const jt808ParseAlarmBits = (body: number): Jt808AlarmFlags => {
  return {
    emergency: (body & (1 << 0)) !== 0,
    overspeed: (body & (1 << 1)) !== 0,
    drivingMalfunction: (body & (1 << 2)) !== 0,
    gnssAntennaDisconnected: (body & (1 << 5)) !== 0,
    gnssAntennaShortCircuited: (body & (1 << 6)) !== 0,
    lowBattery: (body & (1 << 7)) !== 0,
    powerCut: (body & (1 << 8)) !== 0,
    accumulatedOverspeed: (body & (1 << 18)) !== 0,
    timeoutParking: (body & (1 << 19)) !== 0,
    illegalIgnition: (body & (1 << 27)) !== 0,
    illegalDisplacement: (body & (1 << 28)) !== 0,
  };
}

export default jt808ParseAlarmBits;