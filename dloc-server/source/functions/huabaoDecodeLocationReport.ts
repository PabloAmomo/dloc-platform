const huabaoDecodeLocationReport = (data: Buffer) => {
  const alarmFlags = data.readUInt32BE(0);
  const status = data.readUInt32BE(4);
  const lat = data.readUInt32BE(8) / 1e6;
  const lon = data.readUInt32BE(12) / 1e6;
  const altitude = data.readUInt16BE(16);
  const speed = data.readUInt16BE(18);
  const direction = data.readUInt16BE(20);

  const timeBCD = data.subarray(22, 28);
  const time = `20${timeBCD[0].toString(16).padStart(2, "0")}-${timeBCD[1]
    .toString(16)
    .padStart(2, "0")}-${timeBCD[2].toString(16).padStart(2, "0")} ${timeBCD[3]
    .toString(16)
    .padStart(2, "0")}:${timeBCD[4].toString(16).padStart(2, "0")}:${timeBCD[5]
    .toString(16)
    .padStart(2, "0")}`;

  return {
    alarmFlags,
    status,
    lat,
    lon,
    altitude,
    speed,
    direction,
    time,
  };
};

export default huabaoDecodeLocationReport;
