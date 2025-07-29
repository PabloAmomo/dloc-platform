const toCustomTwoBytes = (value: number) : Buffer => {
  const high = Math.floor(value / 100);
  const low = value % 100;

  return Buffer.from(`${high .toString().padStart(2, '0')}${low.toString().padStart(2, '0')}`, "hex");
}

export default toCustomTwoBytes;