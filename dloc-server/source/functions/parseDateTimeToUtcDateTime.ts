const parseDateTimeToUtcDateTime = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(' ');

  // Valid format: YYYY-MM-DD HH:mm:ss
  if (!datePart || !timePart) null

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute, second);
}

export default parseDateTimeToUtcDateTime;