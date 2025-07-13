const createHexFromNumberWithNBytes = (
  number: number ,
  nBytes: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, 
): string => {
  const bufDuration = Buffer.alloc(nBytes);
  bufDuration.writeUIntBE(number, 0, nBytes);
  return bufDuration.toString('hex').toUpperCase();
}

export default createHexFromNumberWithNBytes;
