import Proto1903HandleConnectionProps from '../protocol1903/models/Proto1903HandleConnectionProps';
import Jt808HandleConnectionProps from '../protocol808/models/Jt808HandleConnectionProps';
import HandlePacketResult from './HandlePacketResult';

type HandleConnection = (
  props: Proto1903HandleConnectionProps | Jt808HandleConnectionProps
) => Promise<HandlePacketResult[]>;

export default HandleConnection;