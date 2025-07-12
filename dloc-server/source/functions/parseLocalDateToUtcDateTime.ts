const parseLocalDateToUtcDateTime = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(' ');

  if (!datePart || !timePart) {
    throw new Error('Invalid date format. Expected "YYYY-MM-DD HH:mm:ss"');
  }

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);

  // new Date(Date.UTC(...)) genera una fecha en UTC
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

export default parseLocalDateToUtcDateTime;