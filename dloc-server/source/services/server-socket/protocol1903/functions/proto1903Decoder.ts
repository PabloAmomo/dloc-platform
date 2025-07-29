const proto1903Decoder = (data: Buffer): string[] => {
  const decodedData = data.toString();
  return decodedData
    .split("#")
    .map((packet) => packet.trim())
    .filter((packet) => packet.length > 0)
    .map((packet) => packet + "#");
};

export default proto1903Decoder;
