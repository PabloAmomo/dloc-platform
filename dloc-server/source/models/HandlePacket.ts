import { HandlePacketResult } from './HandlePacketResult';
import { Persistence } from './Persistence';

export interface HandlePacket {
  ({ imei, remoteAddress, data, persistence }: { imei: string; remoteAddress: string; data: string | Buffer; persistence: Persistence }): Promise<HandlePacketResult>;
}
