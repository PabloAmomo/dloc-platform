import { HandlePacketResult } from "./HandlePacketResult";
import { Persistence } from "./Persistence";

export interface HandlePacket {
  ({
    imei,
    remoteAddress,
    data,
    persistence,
  }: {
    imei: string;
    remoteAddress: string;
    data: any; // TODO: Limit to Buffer or string type
    persistence: Persistence;
  }): Promise<HandlePacketResult>;
}
