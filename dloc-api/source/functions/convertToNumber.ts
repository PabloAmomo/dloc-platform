const convertToNumber = (value: string | undefined, defaultValue: number): number => {
  const result = Number(value);
  return isNaN(result) ? defaultValue : result;
}

export { convertToNumber };