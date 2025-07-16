const proto1903Decoder = (data: Buffer): string[] => {
  const decodedData = data.toString();
  return decodedData.split("#");
}

export default proto1903Decoder;