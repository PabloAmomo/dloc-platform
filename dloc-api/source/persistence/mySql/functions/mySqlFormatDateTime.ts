const mySqlFormatDateTime = (dateTimeUTC: Date): string => { 
  let response = '';

  const year = dateTimeUTC.getFullYear();
  const month = dateTimeUTC.getMonth() + 1;
  const day = dateTimeUTC.getDate();
  const hour = dateTimeUTC.getHours();
  const minute = dateTimeUTC.getMinutes();
  const second = dateTimeUTC.getSeconds();

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