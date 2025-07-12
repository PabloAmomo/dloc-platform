import { Jt808TerminalAttributes } from "../models/Jt808TerminalAttributes";

const jt808ParseTerminalAttributes = (
  body: Buffer
): Jt808TerminalAttributes => {
  let offset = 0;

  const terminalTypeRaw = body.readUInt16BE(offset);
  offset += 2;
  //const terminalType = {
  //  passengerVehicle: !!(terminalTypeRaw & (1 << 0)),
  //  dangerousGoodsVehicle: !!(terminalTypeRaw & (1 << 1)),
  //  ordinaryFreightVehicle: !!(terminalTypeRaw & (1 << 2)),
  //  rentalCar: !!(terminalTypeRaw & (1 << 3)),
  //  hardDiskVideo: !!(terminalTypeRaw & (1 << 6)),
  //  splitMachine: !!(terminalTypeRaw & (1 << 7)),
  //};

  const manufacturerId = body.subarray(offset, offset + 5).toString("ascii");
  offset += 5;

  const simIccid = body.subarray(offset, offset + 13).toString("ascii");
  offset += 15;

  const terminalModel = body.subarray(offset, offset + 5).toString("ascii");
  offset += 6;

  const terminalId = body.subarray(offset, offset + 5).toString("ascii");
  offset += 6;

  const version = body.subarray(offset, offset + 16).toString("ascii");
  offset += 16;

  return {
    manufacturerId,
    terminalModel,
    terminalId,
    simIccid,
    version,
  };
};

export default jt808ParseTerminalAttributes;
