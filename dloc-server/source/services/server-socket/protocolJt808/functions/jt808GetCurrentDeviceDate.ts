const JT808_TIMEZONE_HOURS_OFFSET = 8;

const jt808GetCurrentDeviceDate = () => {
  const now = new Date();
  const utcTimestamp = now.getTime();
  const offsetMs = JT808_TIMEZONE_HOURS_OFFSET * 60 * 60 * 1000;

  return new Date(utcTimestamp + offsetMs);
}

export default jt808GetCurrentDeviceDate;