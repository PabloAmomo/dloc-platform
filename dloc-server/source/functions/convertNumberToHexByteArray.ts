const convertNumberToHexByteArray = (num: number): [number, number] => {
  if (num < 0 || num > 0xffff) {
    throw new RangeError("El número debe estar entre 0 y 65535 (0xFFFF)");
  }

  const high = (num >> 8) & 0xff; // byte alto
  const low = num & 0xff;         // byte bajo

  return [high, low];
}

export default convertNumberToHexByteArray;