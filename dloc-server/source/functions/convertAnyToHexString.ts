const convertAnyToHexString = (data: any): string => {
  const hexData: string = data
    .toString("hex")
    .toUpperCase()
    .replace(/(.{2})/g, "$1 ")
    .trim();
  return hexData;
};

export default convertAnyToHexString;