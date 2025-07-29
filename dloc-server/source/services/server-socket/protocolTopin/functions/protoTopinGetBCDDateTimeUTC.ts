const protoTopinGetBCDDateTimeUTC = (buffer: Buffer): Date => {
  if (buffer.length < 6) {
    throw new Error("Buffer length is less than 6 bytes, cannot extract date.");
  }

  const dateTimeUTC = `20${buffer[0].toString(16).padStart(2, "0")}-${buffer[1]
    .toString(16)
    .padStart(2, "0")}-${buffer[2].toString(16).padStart(2, "0")}T${buffer[3].toString(16).padStart(2, "0")}:${buffer[4]
    .toString(16)
    .padStart(2, "0")}:${buffer[5].toString(16).padStart(2, "0")}.000Z`;

  return new Date(dateTimeUTC);
};

export default protoTopinGetBCDDateTimeUTC;