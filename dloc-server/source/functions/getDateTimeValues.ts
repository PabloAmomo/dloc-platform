const getDateTimeValues = (
  date: Date,
  utc: boolean
): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const year = utc ? date.getUTCFullYear() - 2000 : date.getFullYear() - 2000; // Year offset for Topin protocol
  const month = utc ? date.getUTCMonth() + 1 : date.getMonth() + 1; // Months are 0-indexed in JavaScript
  const day = utc ? date.getUTCDate() : date.getDate();
  const hours = utc ? date.getUTCHours() : date.getHours();
  const minutes = utc ? date.getUTCMinutes() : date.getMinutes();
  const seconds = utc ? date.getUTCSeconds() : date.getSeconds();

  return {
    year, // Year (offset by 2000)
    month, // Month (1-12)
    day, // Day (1-31)
    hours, // Hours (0-23)
    minutes, // Minutes (0-59)
    seconds, // Seconds (0-59)
  };
};

export default getDateTimeValues;
