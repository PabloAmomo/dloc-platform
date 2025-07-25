import { Persistence } from '../../../../models/Persistence';
import HandlePacketResult from '../../models/HandlePacketResult';
import { ProtoGt06Packet } from './ProtoGt06Packet';

export default interface ProtoGt06ProcessPacketProps {
  remoteAddress: string;
  response: HandlePacketResult;
  gt06Packet: ProtoGt06Packet;
  counter: number;
  persistence: Persistence;
  prefix: string
}
