import { printMessage } from "../../../../functions/printMessage";
import { CACHE_IMEI } from "../../../../infraestucture/caches/cacheIMEI";
import { CacheImei, CacheImeiEmptyItem } from "../../../../infraestucture/models/CacheImei";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreateResponse0x57 from "./protoTopinCreateResponse0x57";
import protoTopinGetPowerProfileConfig from "../config/protoTopinGetPowerProfileConfig";

const protoTopinProcessPacket0x57: ProtoTopinProcessPacket = async ({
  imei,
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} ✅ synchronization setting data`);

  /** Get the las information about the IMEI */
  const imeiData: CacheImei = CACHE_IMEI.get(imei) ?? CacheImeiEmptyItem;
  const powerProfile = protoTopinGetPowerProfileConfig(imeiData.powerProfile);
  const { uploadSec, ledState } = powerProfile;
  
  printMessage(`${prefix} 🆙 Send upload interval to ${uploadSec} seconds.`);
  printMessage(`${prefix} 💡 Send LED state ${ledState ? "ON" : "OFF"}`);

  (response.response as Buffer[]).push(protoTopinCreateResponse0x57(uploadSec, ledState));

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x57;
