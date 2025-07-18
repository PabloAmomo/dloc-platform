const convertByteArrayToHexString = (bytes: number[]): string =>{
  return bytes.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default convertByteArrayToHexString;