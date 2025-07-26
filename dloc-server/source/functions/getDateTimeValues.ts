const getDateTimeValues = (date: Date): {
  year: number; 
  month: number; 
  day: number; 
  hours: number; 
  minutes: number; 
  seconds: number;
} => {
  const year = date.getFullYear() - 2000; // Year offset for Topin protocol
  const month = date.getMonth() + 1; // Months are 0-indexed in JavaScript
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return {
    year, // Year (offset by 2000)
    month, // Month (1-12)
    day, // Day (1-31)
    hours, // Hours (0-23)
    minutes, // Minutes (0-59)
    seconds // Seconds (0-59)
  };
}