import { Persistence } from '../../../../models/Persistence';
import Jt808HandlePacket from './Jt808HandlePacket';

export default  interface Jt808HandleConnectionProps {
  imei: string;
  remoteAddress: string;
  data: Buffer; 
  handlePacket: Jt808HandlePacket;
  persistence: Persistence;
  counter: number; 
  disconnect: () => void;
}