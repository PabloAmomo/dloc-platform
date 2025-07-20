import { printMessage } from "../../../../functions/printMessage";
import { Jt808LocationPacket } from "../models/Jt808LocationPacket";
import jt808ParseAlarmBits from "./jt808ParseAlarmBits";
import jt808ParseStatusBits from "./jt808ParseStatusBits";

const jt808DecodeLocations = (
  body: Buffer,
  multiLocations: boolean,
  prefix: string 
): {
  count: number;
  locations: Jt808LocationPacket[];
} => {
  const locations: Jt808LocationPacket[] = [];
  let offset = 0;

  let count = 1;
  if (multiLocations) {
    count = body.readUInt16BE(offset);
    offset += 2;
  }

  for (let i = 0; i < count; i++) {
    const dataType = multiLocations ? body.readUInt8(offset++) : 0;
    const locLength = body.readUInt16BE(offset);
    offset += 2;

    if (locLength === 0) {
      printMessage(`${prefix} 🧭 ❌ Invalid location data size (${locLength} bytes is not valid value)`);
      continue;
    }

    const locData = body.subarray(offset, offset + locLength);
    offset += locLength - 1;

    const alarm = locData.readUInt32BE(0);
    const status = locData.readUInt32BE(4);
    const lat = locData.readUInt32BE(8) / 1e6;
    const lng = locData.readUInt32BE(12) / 1e6;
    const altitude = locData.readUInt16BE(16);
    const speed = locData.readUInt16BE(18);
    const direction = locData.readUInt16BE(20);

    const timeBCD = locData.subarray(22, 28);
    const dateTimeUTC = `20${timeBCD[0]
      .toString(16)
      .padStart(2, "0")}-${timeBCD[1]
      .toString(16)
      .padStart(2, "0")}-${timeBCD[2]
      .toString(16)
      .padStart(2, "0")}T${timeBCD[3]
      .toString(16)
      .padStart(2, "0")}:${timeBCD[4]
      .toString(16)
      .padStart(2, "0")}:${timeBCD[5].toString(16).padStart(2, "0")}.000Z`;
   
    let gsmSignal = -1;
    let satellites = -1;
    let batteryLevel = -1;
    let aditionalStatusInfo = Buffer.alloc(0);
    let lbsInfo = Buffer.alloc(0);

    const extraData = jt808ParseTypedBlocks(locData, 28);

    for (const block of extraData) {
      if (block.type === 0x30) gsmSignal = block.data.readUInt8(0);
      else if (block.type === 0x31) satellites = block.data.readUInt8(0);
      else if (block.type === 0x04) batteryLevel = block.data.readUInt8(1);
      else if (block.type === 0xee) lbsInfo = block.data;
      else if (block.type === 0xe7) aditionalStatusInfo = block.data;
    }

    locations.push({
      dataType,
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
      gsmSignal,
      batteryLevel,
      satellites,
      aditionalStatusInfo,
      lbsInfo,
    });
  }

  return {
    count,
    locations,
  };
};

export default jt808DecodeLocations;

type TypedBlock = {
  type: number;
  length: number;
  data: Buffer;
};

function jt808ParseTypedBlocks(
  buffer: Buffer,
  start: number = 0
): TypedBlock[] {
  const result: TypedBlock[] = [];
  let offset = start;

  while (offset + 2 <= buffer.length) {
    const type = buffer.readUInt8(offset++);
    const length = buffer.readUInt8(offset++);

    if (offset + length > buffer.length) break;

    const data = buffer.subarray(offset, offset + length);
    offset += length;

    result.push({ type, length, data });
  }

  return result;
}
