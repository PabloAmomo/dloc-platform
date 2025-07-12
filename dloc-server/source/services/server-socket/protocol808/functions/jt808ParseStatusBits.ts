type J808StatusFlags = {
  acc: boolean;
  positioning: boolean;
  southLatitude: boolean;
  westLongitude: boolean;
  oilLineDisconnected: boolean;
  gpsPositioning: boolean;
  beidouPositioning: boolean;
  glonassPositioning: boolean;
  galileoPositioning: boolean;
  moving: boolean;
};

const  jt808ParseStatusBits = (statusInt: number): J808StatusFlags => {
  return {
    acc: (statusInt & (1 << 0)) !== 0,
    positioning: (statusInt & (1 << 1)) !== 0,
    southLatitude: (statusInt & (1 << 2)) !== 0,
    westLongitude: (statusInt & (1 << 3)) !== 0,
    oilLineDisconnected: (statusInt & (1 << 10)) !== 0,
    gpsPositioning: (statusInt & (1 << 18)) !== 0,
    beidouPositioning: (statusInt & (1 << 19)) !== 0,
    glonassPositioning: (statusInt & (1 << 20)) !== 0,
    galileoPositioning: (statusInt & (1 << 21)) !== 0,
    moving: (statusInt & (1 << 22)) !== 0,
  };
}

export default jt808ParseStatusBits;