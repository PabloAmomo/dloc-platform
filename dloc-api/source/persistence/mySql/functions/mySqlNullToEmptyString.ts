const mySqlNullToEmptyString = (value: any): string => {
  return value == null || value == 'null' ? '' : value;
};

export { mySqlNullToEmptyString };