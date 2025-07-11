const huabaoTimeSyncBody = (date: Date = new Date()): Buffer => {
  const buffer = Buffer.alloc(7);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() es 0-indexado
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  buffer.writeUInt16BE(year, 0);  // bytes 0–1
  buffer.writeUInt8(month, 2);    // byte 2
  buffer.writeUInt8(day, 3);      // byte 3
  buffer.writeUInt8(hour, 4);     // byte 4
  buffer.writeUInt8(minute, 5);   // byte 5
  buffer.writeUInt8(second, 6);   // byte 6

  return buffer;
}

export default huabaoTimeSyncBody;