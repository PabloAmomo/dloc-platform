const jt808FrameDecode = (buf: Buffer): Buffer  => {
  if (buf.length < 2) {
    return Buffer.alloc(0);
  }

  const startByte = buf[0];

  if (startByte === "(".charCodeAt(0)) {
    const endIndex = buf.indexOf(")".charCodeAt(0), 1);
    if (endIndex >= 0) {
      return buf.subarray(0, endIndex + 1);
    }
  } else {
    const delimiter = buf.readUInt8(0);
    const alternative = delimiter === 0xe7;

    const endIndex = buf.indexOf(delimiter, 1);
    if (endIndex >= 0) {
      const tempResult: number[] = [];
      let i = 0;

      while (i <= endIndex && i < buf.length) {
        const b = buf[i++];
        if (alternative && (b === 0xe6 || b === 0x3e)) {
          const ext = buf[i++];
          if (b === 0xe6 && ext === 0x01) {
            tempResult.push(0xe6);
          } else if (b === 0xe6 && ext === 0x02) {
            tempResult.push(0xe7);
          } else if (b === 0x3e && ext === 0x01) {
            tempResult.push(0x3e);
          } else if (b === 0x3e && ext === 0x02) {
            tempResult.push(0x3d);
          }
        } else if (!alternative && b === 0x7d) {
          const ext = buf[i++];
          if (ext === 0x01) {
            tempResult.push(0x7d);
          } else if (ext === 0x02) {
            tempResult.push(0x7e);
          }
        } else {
          tempResult.push(b);
        }
      }

      return Buffer.from(tempResult);
    }
  }

  return Buffer.alloc(0);
};

export default jt808FrameDecode;
