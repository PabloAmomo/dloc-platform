import net from "node:net";
import { PowerProfileType } from "../enums/PowerProfileType";
import { CacheImei } from "../infraestucture/models/CacheImei";
import { HandlePacketResult } from "./HandlePacketResult";

export type ServerSocketHandlerProcessProps = {
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
