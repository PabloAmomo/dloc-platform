import net from "node:net";
import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { CacheImei } from "../../../../infraestucture/models/CacheImei";
import { PowerProfileType } from "../../../../enums/PowerProfileType";

type Jt808HandlerProcessProps = {
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

export default Jt808HandlerProcessProps;
