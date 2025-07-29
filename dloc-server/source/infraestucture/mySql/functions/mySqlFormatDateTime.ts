const mySqlFormatDateTime = (dateTimeUTC: Date): string => { 
  let response = '';

  const year = dateTimeUTC.getUTCFullYear();
  const month = dateTimeUTC.getUTCMonth() + 1;
  const day = dateTimeUTC.getUTCDate();
  const hour = dateTimeUTC.getUTCHours();
  const minute = dateTimeUTC.getUTCMinutes();
  const second = dateTimeUTC.getUTCSeconds();

  response += year.toString().padStart(4, '0');
  response += '-';
  response += month.toString().padStart(2, '0');
  response += '-';
  response += day.toString().padStart(2, '0');
  response += ' ';
  response += hour.toString().padStart(2, '0');
  response += ':';
  response += minute.toString().padStart(2, '0');
  response += ':';
  response += second.toString().padStart(2, '0');

  return response;
};

export { mySqlFormatDateTime };