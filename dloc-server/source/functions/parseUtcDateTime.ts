import { isValidDate } from "./isValidDate";

const parseUtcDateTime = (date: string, time: string): Date | null => {
  if (date == '') return null;
  if (time == '') time = '000000';

  const dateValue: Date = new Date(`
  20${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4, 6)} 
  ${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)} UTC
  `);

  return isValidDate(dateValue) ? dateValue : null;
};

export { parseUtcDateTime }