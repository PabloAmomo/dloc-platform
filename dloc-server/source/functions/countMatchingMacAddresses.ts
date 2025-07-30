import { WifiAccessPoint } from "../models/WifiAccessPoint";

const countMatchingMacAddresses = (list1: WifiAccessPoint[], list2: WifiAccessPoint[]): number => {
  const macSet = new Set(list1.map((device) => device.macAddress.toLowerCase()));

  let count = 0;
  for (const device of list2) {
    if (macSet.has(device.macAddress.toLowerCase())) count++;
  }

  return count;
};

export default countMatchingMacAddresses;
