const getUtcDateTime = (withSeparators: boolean = true): string => {
  const date = new Date();
  const sepDate = withSeparators ? "-" : "";
  const sepTime = withSeparators ? ":" : "";
  return (
    "" +
    date.getUTCFullYear() +
    sepDate +
    twoDigits(date.getUTCMonth() + 1) +
    sepDate +
    twoDigits(date.getUTCDate()) +
    (withSeparators ? " " : "") +
    twoDigits(date.getUTCHours()) +
    sepTime +
    twoDigits(date.getUTCMinutes()) +
    sepTime +
    twoDigits(date.getUTCSeconds())
  );
};

const twoDigits = (value: number): string => {
  return value < 10 ? "0" + value : "" + value;
};

export { getUtcDateTime };
