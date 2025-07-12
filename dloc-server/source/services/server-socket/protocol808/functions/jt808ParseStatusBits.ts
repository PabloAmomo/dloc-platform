import { Jt808StatusFlags } from "../models/Jt808StatusFlags";

const  jt808ParseStatusBits = (body: number): Jt808StatusFlags => {
  return {
    acc: (body & (1 << 0)) !== 0,
    positioning: (body & (1 << 1)) !== 0,
    southLatitude: (body & (1 << 2)) !== 0,
    westLongitude: (body & (1 << 3)) !== 0,
    oilLineDisconnected: (body & (1 << 10)) !== 0,
    gpsPositioning: (body & (1 << 18)) !== 0,
    beidouPositioning: (body & (1 << 19)) !== 0,
    glonassPositioning: (body & (1 << 20)) !== 0,
    galileoPositioning: (body & (1 << 21)) !== 0,
    moving: (body & (1 << 22)) !== 0,
  };
}

export default jt808ParseStatusBits;