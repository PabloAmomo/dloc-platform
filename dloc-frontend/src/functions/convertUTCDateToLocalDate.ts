const convertUTCDateToLocalDate = (stringUTC: string | undefined | null) : Date | undefined => {
  if (!stringUTC) return undefined;
  return new Date(stringUTC);
}

export default convertUTCDateToLocalDate;