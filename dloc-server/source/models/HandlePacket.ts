import { HandlePacketResult } from "./HandlePacketResult";
import { Persistence } from "./Persistence";

export interface HandlePacket {
  ({
    imei,
    remoteAddress,
    data,
    persistence,
    counter,
  }: {
    imei: string;
    remoteAddress: string;
    data: any; // TODO: Limit to Buffer or string type
    persistence: Persistence;
    counter: number;
  }): Promise<HandlePacketResult>;
}
