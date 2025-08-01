import { Persistence } from '../../../models/Persistence';
import Jt808HandlePacket from '../protocolJt808/models/Jt808HandlePacket';
import Proto1903HandlePacket from '../protocolProto1903/models/Proto1903HandlePacket';

export default  interface HandleConnectionProps {
  imei: string;
  remoteAddress: string;
  data: Buffer[] | string[]; 
  handlePacket: Proto1903HandlePacket | Jt808HandlePacket;
  persistence: Persistence;
  counter: number; 
  disconnect: () => void;
}