const proto1903Decoder = (data: string): string => {
  return data + data.endsWith("#") ? "" : "#"; // Append a hash to the data for protocol 1903
}

export default proto1903Decoder;