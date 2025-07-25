import HandlePacketResult from '../../models/HandlePacketResult';
import ProtoGt06HandlePacketProps from './ProtoGt06HandlePacketProps';

type ProtoGt06HandlePacket = (
  props: ProtoGt06HandlePacketProps
) => Promise<HandlePacketResult>;

export default ProtoGt06HandlePacket;
