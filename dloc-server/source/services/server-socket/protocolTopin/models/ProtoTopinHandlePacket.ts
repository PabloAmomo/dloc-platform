import HandlePacketResult from '../../models/HandlePacketResult';
import ProtoTopinHandlePacketProps from './ProtoTopinHandlePacketProps';

type ProtoTopinHandlePacket = (
  props: ProtoTopinHandlePacketProps
) => Promise<HandlePacketResult>;

export default ProtoTopinHandlePacket;
