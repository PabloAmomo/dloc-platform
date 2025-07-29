import { configApp } from "config/configApp";

const isValidImei = (imei: string): boolean => {
  const numeriImeiPattern = new RegExp(`^[0-9]{${configApp.maxLengths.imei}}$`);
  const sharedImeiPattern = new RegExp(`^[sS][a-zA-Z0-9]{${configApp.maxLengths.imei - 1}}$`);
  return numeriImeiPattern.test(imei) || sharedImeiPattern.test(imei);
};

export default isValidImei;
