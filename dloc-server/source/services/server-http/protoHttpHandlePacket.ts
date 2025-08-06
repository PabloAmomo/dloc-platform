import { PowerProfileType } from "./../../enums/PowerProfileType";
import getPowerProfile from "../../functions/getPowerProfile";
import positionAddPositionAndUpdateDevice from "../../functions/positionAddPositionAndUpdateDevice";
import positionUpdateBatteryAndLastActivity from "../../functions/positionUpdateBatteryAndLastActivity";
import positionUpdateLastActivityAndAddHistory from "../../functions/positionUpdateLastActivityAndAddHistory";
import { printMessage } from "../../functions/printMessage";
import { CACHE_IMEI } from "../../infraestucture/caches/cacheIMEI";
import { CACHE_POSITION } from "../../infraestucture/caches/cachePosition";
import { CacheImei, CacheImeiEmptyItem } from "../../infraestucture/models/CacheImei";
import { Persistence } from "../../models/Persistence";
import { PositionPacket } from "../../models/PositionPacket";
import { PowerProfileConfig } from "../../models/PowerProfileConfig";
import protoHttpGetPowerProfileConfig from "./config/protoHttpGetPowerProfileConfig";

const protoHttpHandlePacket = async (persistence: Persistence, positionPacket: PositionPacket) => {
  const { imei, remoteAddress } = positionPacket;
  const hasPosition: boolean = positionPacket.lat !== -999 && positionPacket.lng !== -999;
  const prefix = `[${imei}] (${remoteAddress})`;
  let message: string = "ok";

  /** Get activity */
  const activity = positionPacket.activity ? JSON.parse(positionPacket.activity) : {};

  /** Get the las information about the IMEI */
  const imeiData: CacheImei = CACHE_IMEI.get(imei) ?? CacheImeiEmptyItem;

  /** Get power profile for the imei */
  const { newPowerProfileType, powerProfileChanged, lastPowerProfileChecked, needProfileRefresh } =
    await getPowerProfile(
      imei,
      persistence,
      imeiData.lastPowerProfileChecked,
      prefix,
      activity?.isNewConnection,
      imeiData.powerProfile,
      protoHttpGetPowerProfileConfig
    );

  /** update the information in the cache */
  CACHE_IMEI.updateOrCreate(imei, {
    powerProfile: newPowerProfileType,
    lastPowerProfileChecked,
  });

  /** Add position packet to cache */
  if (hasPosition) {
    printMessage(`${prefix} ✅ updating cache [${JSON.stringify(positionPacket)}]`);
    CACHE_POSITION.set(imei, { ...positionPacket, dateTimeUtc: new Date() });
  }

  /** Update position */
  if (!hasPosition)
    message = await positionUpdateBatteryAndLastActivity(imei, remoteAddress, persistence, positionPacket.batteryLevel);
  else {
    message = await positionAddPositionAndUpdateDevice(imei, remoteAddress, positionPacket, persistence);
    if (message === "ok")
      message = await positionUpdateLastActivityAndAddHistory(
        imei,
        remoteAddress,
        JSON.stringify(positionPacket),
        persistence,
        true
      );
  }

  /** Get power profile configuration */
  const powerProfileConfig: PowerProfileConfig = protoHttpGetPowerProfileConfig(newPowerProfileType);
  const { uploadSec, heartBeatSec, ledState } = powerProfileConfig;
  printMessage(
    `${prefix} 📡 set heartbeat ${heartBeatSec} sec, leds [${ledState}], report Interval [${uploadSec} sec]`
  );

  /** */
  return {
    code: message === "ok" ? 200 : 500,
    result: { message, heartBeatSec, uploadSec, ledState, powerProfile: newPowerProfileType },
  };
};

export { protoHttpHandlePacket };
