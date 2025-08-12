import { GoogleGeoPositionResponse } from "./../../../../models/GoogleGeoPositionResponse";
import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";
import { CACHE_LBS } from "../../../../infraestucture/caches/cacheLBS";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopisPersistLbsResponse from "./protoTopisPersistLbsResponse";

const infoMessages: { [key: number]: string } = {
  0x00: `🤷‍♂️ unknown or not reason defined`,
  0x01: `⌛️ Time is incorrect`,
  0x02: `🗼 Less than 2 LBS`,
  0x03: `📶 Less than 3 Wifi`,
  0x04: `🗼 LBS more than 3 times`,
  0x05: `📡 Same LBS and Wifi data 🗼🧭`,
  0x06: `🚫 Prohibits LBS uploading, without Wifi`,
  0x07: `📍 GPS spacing is less than 50 meters`,
};

const protoTopinProcessPacket0x80: ProtoTopinProcessPacket = async ({
  imei,
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} ✅ Manual position received. Check reason...`);

  const code = topinPacket?.informationContent[0] ?? 0x00;
  const message = infoMessages[code];
  printMessage(`${prefix} 🙋 Manual Position: ${message}`);

  /** Use las LBS if is valid and the message is "same lbs and wifi data" or "GPS spacing is less than 50 meters" */
  if (code === 0x05 || code === 0x07) {
    const lastLbsKey = CACHE_IMEI.get(imei)?.lastLBSKey;
    if (!lastLbsKey) printMessage(`${prefix} ❌ No last LBS key found. Cannot reprocess request 0x07.`);
    else {
      printMessage(`${prefix} 🗼 [LBS] ✅ Reprocessing last LBS with key: ${lastLbsKey}`);
      const lbsGetResponse = CACHE_LBS.get(lastLbsKey)?.response as GoogleGeoPositionResponse;

      const dateTimeUtc = new Date(Date.now() - 2000); // Use 2 seconds ago to avoid issues with the database position time

      protoTopisPersistLbsResponse({
        imei,
        remoteAddress,
        lbsGetResponse,
        persistence,
        topinPacket,
        dateTimeUtc,
        prefix,
        response,
        gsmSignal: -1,
        batteryLevel: -1,
      });
    }
  }

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x80;
