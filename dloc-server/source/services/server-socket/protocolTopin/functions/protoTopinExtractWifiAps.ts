import { printMessage } from "../../../../functions/printMessage";
import config from "../../../../config/config";
import { WifiAccessPoint } from "../../../../models/WifiAccessPoint";
import convertPercentToRSSI from "../../../../functions/convertPercentToRSSI";

const MAX_TIME_DIFFERENCE_MS = config.MAX_TIME_DIFFERENCE_MS;

const protoTopinExtractWifiAps = (
  prefix: string,
  length: number,
  data: Buffer
): WifiAccessPoint[] => {
  const responseData: WifiAccessPoint[] = [];
  try {
    if (data.length < 6) {
      printMessage(`${prefix} ❌ Invalid Wifi packet length ${data.length}`);
      return responseData;
    }

    const year = 2000 + parseInt(getDateData(data, 0));
    const month = getDateData(data, 1);
    const day = getDateData(data, 2);
    const hours = getDateData(data, 3);
    const minutes = getDateData(data, 4);
    const seconds = getDateData(data, 5);
    const dateTimeUtcString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
    const dateTimeUtc = new Date(dateTimeUtcString);

    const timeDifference = dateTimeUtc.getTime() - new Date().getTime();
    const minutesAfterNow = timeDifference / 1000 / 60;
    if (timeDifference > MAX_TIME_DIFFERENCE_MS) {
      printMessage(
        `${prefix} ❌ Location packet date/time is ${minutesAfterNow} minutes in the future of the current time.`
      );
      return responseData;
    }

    if (data.length < 6 + length * 7) {
      printMessage(`${prefix} ❌ Invalid Wifi packet length ${data.length} for expected length ${6 + length * 7}`);
      return responseData;
    }
    if (length === 0) {
      printMessage(`${prefix} ❌ No Wifi Access Points found in packet.`);
      return responseData;
    }

    let count = 0;
    let start = 6;
    while (count++ < length) {
      const macAddress = data
        .slice(start, start + 6)
        .toString("hex")
        .toUpperCase().match(/.{1,2}/g)?.join(":") || "";
      responseData.push({
        macAddress,
        signalStrength: convertPercentToRSSI(data[start + 6]),
      });
      start += 7;
    }

  } catch (err: Error | any) {
    printMessage(`${prefix} ❌ error extracting Wifi Aps from wifi packet [${err.message}]`);
  }
  return responseData;
};

const getDateData = (data: Buffer, index: number) => {
  return data[index].toString(16).padStart(2, "0").toString().padStart(2, "0");
};

export default protoTopinExtractWifiAps;
