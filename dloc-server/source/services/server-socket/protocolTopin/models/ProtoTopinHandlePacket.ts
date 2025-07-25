import HandlePacketResult from '../../models/HandlePacketResult';
import ProtoGt06HandlePacketProps from './ProtoTopinHandlePacketProps';

type ProtoTopinHandlePacket = (
  props: ProtoGt06HandlePacketProps
) => Promise<HandlePacketResult>;

export default ProtoTopinHandlePacket;
