import { HandlePacketResult } from './HandlePacketResult';
import { Persistence } from './Persistence';

export interface HandlePacket {
  ({ imei, remoteAdd, data, persistence }: { imei: string; remoteAdd: string; data: string; persistence: Persistence }): Promise<HandlePacketResult>;
}
