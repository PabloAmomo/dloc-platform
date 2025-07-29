import { Jt808TerminalAttributes } from "../models/Jt808TerminalAttributes";

const jt808ParseTerminalAttributes = (
  body: Buffer
): Jt808TerminalAttributes => {
  let offset = 2;

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
