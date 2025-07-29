const jt808FrameEncode = (buf: Buffer): Buffer => {
  const alternative = buf[0] === 0xe7;
  const startIndex = 0;

  const result: number[] = [];

  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];

    if (alternative && (b === 0xe6 || b === 0x3d || b === 0x3e)) {
      result.push(b === 0xe6 ? 0xe6 : 0x3e);
      result.push(b === 0x3d ? 0x02 : 0x01);
    } else if (
      alternative &&
      b === 0xe7 &&
      i !== startIndex &&
      i < buf.length - 1
    ) {
      result.push(0xe6);
      result.push(0x02);
    } else if (!alternative && b === 0x7d) {
      result.push(0x7d, 0x01);
    } else if (
      !alternative &&
      b === 0x7e &&
      i !== startIndex &&
      i < buf.length - 1
    ) {
      result.push(0x7d, 0x02);
    } else {
      result.push(b);
    }
  }

  return Buffer.from(result);
};

export default jt808FrameEncode;
