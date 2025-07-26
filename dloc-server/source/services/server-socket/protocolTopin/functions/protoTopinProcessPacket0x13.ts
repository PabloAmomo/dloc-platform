import { get } from "http";
import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";
import { CacheImei, CacheImeiEmptyItem } from "../../../../infraestucture/models/CacheImei";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreateResponse0x13 from "./protoTopinCreateResponse0x13";
import protoTopinGetPowerProfileConfig from "./protoTopinGetPowerProfileConfig";

const protoTopinProcessPacket0x13: ProtoTopinProcessPacket = async ({
  imei,
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} 🎛️  status package received. Sending interval time.`);

  const battery = topinPacket.informationContent[0];
  const softwareVersion = topinPacket.informationContent[1];
  const timezone = topinPacket.informationContent[2];
  const intervalTimeMin = topinPacket.informationContent[3];

  /** Get the las information about the IMEI */
  const imeiData: CacheImei = CACHE_IMEI.get(imei) ?? CacheImeiEmptyItem;
  const powerProfile = protoTopinGetPowerProfileConfig(imeiData.powerProfile);

  let uploadIntervalMin = Math.floor(powerProfile.uploadSec / 60); 
  if (uploadIntervalMin === 0) uploadIntervalMin = 1; // Setting a default value of 1 minute if undefined
  (response.response as Buffer[]).push(protoTopinCreateResponse0x13(uploadIntervalMin));

  printMessage(`${prefix} ❤️  Request upload interval to ${uploadIntervalMin} minutes.`);
  printMessage(`${prefix} 🌎 Current time zone ${timezone}`);
  printMessage(`${prefix} 🔋 Battery level: ${battery}%`);

  await positionUpdateBatteryAndLastActivity(response.imei, remoteAddress, persistence, battery);

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x13;
