import { PowerProfileType } from "../../../../enums/PowerProfileType";
import proto1903PowerProfileConfig from "./proto1903PowerProfileConfig";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";
import { CACHE_POSITION } from "../../../../infraestucture/caches/cachePosition";
import { CacheImei } from "../../../../infraestucture/models/CacheImei";
import { CachePosition } from "../../../../infraestucture/models/CachePosition";

const proto1903MustSendToTerminalRequestReport = (
  imei: string,
  newPowerProfileType: PowerProfileType,
  imeiData: CacheImei
): boolean => {
  const { forceReportLocInMs } = proto1903PowerProfileConfig(newPowerProfileType);

  const lastPosPacket: CachePosition | undefined = CACHE_POSITION.get(imei);

  const currentTime = Date.now();

  const lastPosMs = !lastPosPacket
    ? forceReportLocInMs
    : currentTime - lastPosPacket.datetimeUtc.getTime();

  const needSendToTerminal =
    forceReportLocInMs > 0 &&
    lastPosMs >= forceReportLocInMs &&
    currentTime - (imeiData.lastReportRequestTimestamp) >=
      forceReportLocInMs;

  if (needSendToTerminal) {
    CACHE_IMEI.updateOrCreate(imei, { ...imeiData,
      lastReportRequestTimestamp: currentTime,
    });
  }

  return needSendToTerminal;
};

export default proto1903MustSendToTerminalRequestReport;
