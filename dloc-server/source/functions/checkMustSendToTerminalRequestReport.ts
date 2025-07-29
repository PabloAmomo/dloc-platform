import { CACHE_IMEI } from "../infraestucture/caches/cacheIMEI";
import { CACHE_POSITION } from "../infraestucture/caches/cachePosition";
import { CacheImei } from "../infraestucture/models/CacheImei";
import { CachePosition } from "../infraestucture/models/CachePosition";
import { printMessage } from "./printMessage";

const checkMustSendToTerminalRequestReport = (
  prefix: string,
  imei: string,
  imeiData: CacheImei,
  forceReportLocInSec: number
): boolean => {
  const forceReportLocInMs = forceReportLocInSec * 1000; // Convert seconds to milliseconds

  const lastPosPacket: CachePosition | undefined = CACHE_POSITION.get(imei);

  const currentTime = Date.now();

  const lastPosMs = !lastPosPacket ? forceReportLocInMs : currentTime - (lastPosPacket?.dateTimeUtc?.getTime() ?? 0);

  const needSendToTerminal =
    forceReportLocInMs > 0 &&
    lastPosMs >= forceReportLocInMs &&
    currentTime - imeiData.lastReportRequestTimestamp >= forceReportLocInMs;

  if (needSendToTerminal) {
    CACHE_IMEI.updateOrCreate(imei, { ...imeiData, lastReportRequestTimestamp: currentTime });
  }

  if (needSendToTerminal)
    printMessage(
      `${prefix} 🧭 last position received (${(lastPosMs / 1000).toFixed(0)} sec ago) at ${new Date(
        imeiData.lastReportRequestTimestamp
      ).toISOString()}`
    );

  return needSendToTerminal;
};

export default checkMustSendToTerminalRequestReport;
