import { Persistence } from '../../../../models/Persistence';
import HandlePacketResult from '../../models/HandlePacketResult';
import { Jt808Packet } from './Jt808Packet';

export default interface Jt808ProcessPacketProps {
  remoteAddress: string;
  response: HandlePacketResult;
  jt808Packet: Jt808Packet;
  counter: number;
  persistence: Persistence;
  prefix: string
}
