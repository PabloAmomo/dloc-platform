import { Persistence } from '../../../../models/Persistence';
import HandlePacketResult from '../../models/HandlePacketResult';
import { ProtoTopinPacket } from './ProtoTopinPacket';

export default interface ProtoTopinProcessPacketProps {
  remoteAddress: string;
  imei: string;
  response: HandlePacketResult;
  topinPacket: ProtoTopinPacket;
  persistence: Persistence;
  prefix: string;
}
