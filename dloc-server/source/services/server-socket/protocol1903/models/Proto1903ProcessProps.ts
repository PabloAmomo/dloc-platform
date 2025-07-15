import net from "node:net";
import { PowerProfileType } from "../../../../enums/PowerProfileType";
import { CacheImei } from "../../../../infraestucture/models/CacheImei";
import { HandlePacketResult } from "../../../../models/HandlePacketResult";

type Proto1903ProcessProps = {
  conn: net.Socket;
  results: HandlePacketResult[];
  imei: string;
  prefix: string;
  counter: number;
  newConnection: boolean;
  powerPrfChanged: boolean;
  needProfileRefresh: boolean;
  imeiData: CacheImei;
  newPowerProfile: PowerProfileType;
  movementsControlSeconds: number;
};

export default Proto1903ProcessProps;
