import huabaoParseAlarmBits from "./huabaoParseAlarmBits";
import huabaoParseStatusBits from "./huabaoParseStatusBits";

/*
0003 //table 76 Numbers of data item，total 3 data（the length of total packet from here）
01  //table 76 Type of location data
0048 //table 77 Length of location report data body(each data length)
00000000 //table 16 Alarm sign(each data length from here)
004C0001 //table 16 status
01598A80 //table 16 latitude
06CBEFF5 //table 16 longtitude
0000 //table 16 altitude
0000 //table 16 speed
0000 //table 16 direction
200330190948 //table 16 time

0104000002EE //table 19 mileage
300116 //table 19 GSM
310100 //table 19 Number of satellites
E4020162 //table 19 battery level
E50101
E60100  
E7080000000000000000 //table 19 status additional infomation
EE0A01CC01262C0CBC089B00 //table 19 4G LBS infomation

*/
const huabaoDecodeLocations = (body: Buffer, multiLocations: boolean) => {
  const records: any[] = [];
  let offset = 0;

  let packetCount = 1;
  if (multiLocations) {
    packetCount = body.readUInt16BE(offset);
    offset += 2;
  }

  for (let i = 0; i < packetCount; i++) {
    const dataType = multiLocations ? body.readUInt8(offset++) : 0;
    const locLength = body.readUInt16BE(offset);
    offset += 2;

    const locData = body.subarray(offset, offset + locLength);
    offset += locLength - 1;

    const alarm = locData.readUInt32BE(0);
    const status = locData.readUInt32BE(4);
    const lat = locData.readUInt32BE(8) / 1e6;
    const lon = locData.readUInt32BE(12) / 1e6;
    const altitude = locData.readUInt16BE(16);
    const speed = locData.readUInt16BE(18);
    const direction = locData.readUInt16BE(20);

    const timeBCD = locData.subarray(22, 28);
    const time = `20${timeBCD[0].toString(16).padStart(2, "0")}-${timeBCD[1]
      .toString(16)
      .padStart(2, "0")}-${timeBCD[2]
      .toString(16)
      .padStart(2, "0")} ${timeBCD[3]
      .toString(16)
      .padStart(2, "0")}:${timeBCD[4]
      .toString(16)
      .padStart(2, "0")}:${timeBCD[5].toString(16).padStart(2, "0")}`;

    let gsmSignal = -1;
    let satellites = -1;
    let batteryPercent = -1;
    let aditionalStatusInfo = Buffer.alloc(0);
    let lbsInfo = Buffer.alloc(0);

    const extraData = parseTypedBlocks(locData, 28);

    for (const block of extraData) {
      if (block.type === 0x30) gsmSignal = block.data.readUInt8(0);
      else if (block.type === 0x31) satellites = block.data.readUInt8(0);
      else if (block.type === 0x04) batteryPercent = block.data.readUInt8(1);
      else if (block.type === 0xee) lbsInfo = block.data;
      else if (block.type === 0xe7) aditionalStatusInfo = block.data;
    }

    records.push({
      dataType,
      alarm,
      alarmFlags: huabaoParseAlarmBits(alarm),
      status,
      statusFlags: huabaoParseStatusBits(status),
      lat,
      lon,
      altitude,
      speed,
      direction,
      time,
      gsmSignal,
      batteryPercent,
      satellites,
      aditionalStatusInfo,
      lbsInfo,
    });
  }

  console.log(`Packet count: ${packetCount}`);
  console.log(`Records: ${JSON.stringify(records, null, 2)}`);

  return {
    packetCount,
    records,
  };
};

export default huabaoDecodeLocations;

type TypedBlock = {
  type: number;
  length: number;
  data: Buffer;
};

function parseTypedBlocks(buffer: Buffer, start: number = 0): TypedBlock[] {
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
