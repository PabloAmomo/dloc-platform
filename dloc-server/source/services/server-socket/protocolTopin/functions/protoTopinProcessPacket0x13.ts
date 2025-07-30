import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";
import { CacheImei, CacheImeiEmptyItem } from "../../../../infraestucture/models/CacheImei";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import positionUpdateSignalStrengthAndLastActivity from "../../../../functions/positionUpdateSignalStrengthAndLastActivity";
import protoTopinCreatePacket0x13 from "./protoTopinCreatePacket0x13";

const protoTopinProcessPacket0x13: ProtoTopinProcessPacket = async ({
  imei,
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} 🎛️  status package received.`);

  const battery = topinPacket.informationContent[0];
  const softwareVersion = topinPacket.informationContent[1];
  const timezone = topinPacket.informationContent[2];
  const signalStrength = topinPacket.informationContent[4];

  printMessage(`${prefix} 📦 [INFO] Software version:  ${softwareVersion}`);
  printMessage(`${prefix} 🌎 [INFO] Current time zone: ${timezone}`);
  printMessage(`${prefix} 🔋 [INFO] Battery level:     ${battery}%`);
  printMessage(`${prefix} 📡 [INFO] Signal strength:   ${signalStrength}%`);

  /** Get the las information about the IMEI */
  const imeiData: CacheImei = CACHE_IMEI.get(imei) ?? CacheImeiEmptyItem;

  (response.response as Buffer[]).push(...protoTopinCreatePacket0x13(prefix, imeiData.powerProfile));
  


  await positionUpdateBatteryAndLastActivity(response.imei, remoteAddress, persistence, battery);

  await positionUpdateSignalStrengthAndLastActivity(response.imei, remoteAddress, persistence, signalStrength);

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x13;
