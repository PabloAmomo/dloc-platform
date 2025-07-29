const formatDate = (date: Date | null | undefined, format: string): string | null => {
  if (!date) return null;

  let fullYear = date.getFullYear();
  let year = fullYear.toString().substring(2);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  return format
    .replace('{fullYear}', fullYear.toString())
    .replace('{year}', year)
    .replace('{month}', (month < 10 ? '0' : '') + month.toString())
    .replace('{day}', (day < 10 ? '0' : '') + day.toString())
    .replace('{hour}', (hour < 10 ? '0' : '') + hour.toString())
    .replace('{minute}', (minute < 10 ? '0' : '') + minute.toString())
    .replace('{second}', (second < 10 ? '0' : '') + second.toString());
};

export default formatDate;
