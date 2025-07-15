import HandlePacketResult from '../../models/HandlePacketResult';
import Jt808HandlePacketProps from './Jt808HandlePacketProps';

type Jt808HandlePacket = (
  props: Jt808HandlePacketProps
) => Promise<HandlePacketResult>;

export default Jt808HandlePacket;
