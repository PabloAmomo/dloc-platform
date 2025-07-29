import GetPowerProfileConfig from '../../models/GetProwerProfileConfig';
import HandleClose from '../../services/server-socket/models/HandleClose';
import HandleEnd from '../../services/server-socket/models/HandleEnd';
import HandleError from '../../services/server-socket/models/HandleError';
import Proto1903HandlePacket from '../../services/server-socket/protocol1903/models/Proto1903HandlePacket';
import Proto1903HandleProcess from '../../services/server-socket/protocol1903/models/Proto1903HandleProcess';
import Jt808HandlePacket from '../../services/server-socket/protocol808/models/Jt808HandlePacket';
import Jt808HandleProcess from '../../services/server-socket/protocol808/models/Jt808HandleProcess';
import ProtoTopinHandlePacket from '../../services/server-socket/protocolTopin/models/ProtoTopinHandlePacket';
import ProtoTopinHandleProcess from '../../services/server-socket/protocolTopin/models/ProtoTopinHandleProcess';

export default interface  ServerSocketHandlerPropsInjection {
  protocol: "PROTO1903" | "JT808" | "TOPIN";
  handleProcess: Proto1903HandleProcess | Jt808HandleProcess | ProtoTopinHandleProcess;
  handlePacket: Proto1903HandlePacket | Jt808HandlePacket | ProtoTopinHandlePacket;
  handleClose: HandleClose;
  handleEnd: HandleEnd;
  handleError: HandleError;
  getPowerProfileConfig: GetPowerProfileConfig;
  decoder: (data: Buffer) => Buffer[] | string[];
}