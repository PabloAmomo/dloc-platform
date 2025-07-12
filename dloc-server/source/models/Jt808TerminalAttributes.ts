export type Jt808TerminalAttributes = {
  terminalType: {
    passengerVehicle: boolean;
    dangerousGoodsVehicle: boolean;
    ordinaryFreightVehicle: boolean;
    rentalCar: boolean;
    hardDiskVideo: boolean;
    splitMachine: boolean;
  };
  manufacturerId: string;
  terminalModel: string;
  terminalId: string;
  simIccid: string;
  hardwareVersion: string;
  firmwareVersion: string;
  gnssSupport: {
    gps: boolean;
    beidou: boolean;
    glonass: boolean;
    galileo: boolean;
  };
  communicationSupport: {
    gprs: boolean;
    cdma: boolean;
    tdScdma: boolean;
    wcdma: boolean;
    cdma2000: boolean;
    tdLte: boolean;
    other: boolean;
  };
};