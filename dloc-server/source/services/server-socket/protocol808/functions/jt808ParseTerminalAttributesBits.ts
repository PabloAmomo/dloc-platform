import { Jt808TerminalAttributes } from "../../../../models/Jt808TerminalAttributes";

const jt808ParseTerminalAttributes = (buf: Buffer): Jt808TerminalAttributes => {
  let offset = 0;

  // 0-1: terminal type (bit flags)
  const terminalTypeRaw = buf.readUInt16BE(offset);
  offset += 2;

  const terminalType = {
    passengerVehicle: !!(terminalTypeRaw & (1 << 0)),
    dangerousGoodsVehicle: !!(terminalTypeRaw & (1 << 1)),
    ordinaryFreightVehicle: !!(terminalTypeRaw & (1 << 2)),
    rentalCar: !!(terminalTypeRaw & (1 << 3)),
    hardDiskVideo: !!(terminalTypeRaw & (1 << 6)),
    splitMachine: !!(terminalTypeRaw & (1 << 7)),
  };

  // 2–6: manufacturer ID (5 bytes)
  const manufacturerId = buf
    .subarray(offset, offset + 5)
    .toString("ascii")
    .replace(/\x00/g, "");
  offset += 5;

  // 7–26: terminal model (20 bytes)
  const terminalModel = buf
    .subarray(offset, offset + 20)
    .toString("ascii")
    .replace(/\x00/g, "");
  offset += 20;

  // 27–33: terminal ID (7 bytes)
  const terminalId = buf
    .subarray(offset, offset + 7)
    .toString("ascii")
    .replace(/\x00/g, "");
  offset += 7;

  // 34–43: SIM ICCID (BCD, 10 bytes)
  const iccidBcd = buf.subarray(offset, offset + 10);
  const simIccid = Array.from(iccidBcd)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  offset += 10;

  // 44: hardware version length
  const hwLength = buf.readUInt8(offset++);

  // 45–(45+n-1): hardware version string
  const hardwareVersion = buf
    .subarray(offset, offset + hwLength)
    .toString("ascii");
  offset += hwLength;

  // next: firmware version length
  const fwLength = buf.readUInt8(offset++);

  // firmware version string
  const firmwareVersion = buf
    .subarray(offset, offset + fwLength)
    .toString("ascii");
  offset += fwLength;

  // GNSS module attribute (1 byte, bit flags)
  const gnssAttr = buf.readUInt8(offset++);

  const gnssSupport = {
    gps: !!(gnssAttr & (1 << 0)),
    beidou: !!(gnssAttr & (1 << 1)),
    glonass: !!(gnssAttr & (1 << 2)),
    galileo: !!(gnssAttr & (1 << 3)),
  };

  // Communication module attribute (1 byte, bit flags)
  const commAttr = buf.readUInt8(offset++);

  const communicationSupport = {
    gprs: !!(commAttr & (1 << 0)),
    cdma: !!(commAttr & (1 << 1)),
    tdScdma: !!(commAttr & (1 << 2)),
    wcdma: !!(commAttr & (1 << 3)),
    cdma2000: !!(commAttr & (1 << 4)),
    tdLte: !!(commAttr & (1 << 5)),
    other: !!(commAttr & (1 << 7)),
  };

  return {
    terminalType,
    manufacturerId,
    terminalModel,
    terminalId,
    simIccid,
    hardwareVersion,
    firmwareVersion,
    gnssSupport,
    communicationSupport,
  };
};

export default jt808ParseTerminalAttributes;
