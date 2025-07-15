import { PowerProfileType } from '../../../../enums/PowerProfileType';
import powerProfileConfig from '../../../../functions/powerProfileConfig';
import { CACHE_POSITION } from '../../../../infraestucture/caches/cachePosition';
import { CachePosition } from '../../../../infraestucture/models/CachePosition';

const proto1903MustSendToTerminalRequestReport = (
  imei: string,
  newPowerProfile: PowerProfileType
): boolean => {
  const { forceReportLocInMs } = powerProfileConfig(newPowerProfile);

  const lastPosPacket: CachePosition | undefined = CACHE_POSITION.get(imei);

  const currentTime = Date.now();

  const lastPosMs = !lastPosPacket
    ? forceReportLocInMs
    : currentTime - lastPosPacket.datetimeUtc.getTime();

  return (
    forceReportLocInMs > 0 &&
    lastPosMs >= forceReportLocInMs
  );
};

export default proto1903MustSendToTerminalRequestReport;
