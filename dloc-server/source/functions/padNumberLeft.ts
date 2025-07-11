const padNumberLeft = (
  value: string | number,
  length: number,
  char: string = '0'
): string => {
  return value.toString().padStart(length, char);
}

export default padNumberLeft;