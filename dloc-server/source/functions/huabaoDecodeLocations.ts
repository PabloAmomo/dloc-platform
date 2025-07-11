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

    console.log(
      `Data Type: ${dataType}, offset: ${offset}, Length: ${locLength}`
    );

    const locData = body.subarray(offset, offset + locLength);
    offset += locLength - 1;

    const alarmFlags = locData.readUInt32BE(0);
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

    // TODO: Asignar los items segun su ID y tamaño
    
    const mileage = locData.subarray(28, 34);
    const gsm = locData.subarray(34, 38);
    const satellites = locData.subarray(38, 41);
    const battery = locData.subarray(41, 44);
    const additionalInfo = locData.subarray(44, 60);
    const lbsInfo = locData.subarray(60, 76);

    records.push({
      dataType,
      alarmFlags,
      status,
      lat,
      lon,
      altitude,
      speed,
      direction,
      time,
      mileage: mileage.toString("hex"),
      gsm: gsm.toString("hex"),
      satellites: satellites.toString("hex"),
      battery: battery.toString("hex"),
      additionalInfo: additionalInfo.toString("hex"),
      lbsInfo: lbsInfo.toString("hex"),
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
