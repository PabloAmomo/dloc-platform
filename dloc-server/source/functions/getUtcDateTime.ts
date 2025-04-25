import { twoDigits } from "./twoDigits";

const getUtcDateTime = (withSeparators: boolean = true) : string => {
  const date = new Date();
  const sepDate = (withSeparators ? "-" : "");
  const sepTime = (withSeparators ? ":" : "");
  return "" + date.getUTCFullYear() + sepDate + twoDigits(date.getUTCMonth() + 1) + sepDate + twoDigits(date.getUTCDate()) +
    (withSeparators ? " " : "") +
    twoDigits(date.getUTCHours()) + sepTime + twoDigits(date.getUTCMinutes()) + sepTime + twoDigits(date.getUTCSeconds());
}

export { getUtcDateTime }