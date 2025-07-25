import net from 'node:net';

import GetPowerProfileConfig from '../../models/GetProwerProfileConfig';
import { Persistence } from '../../models/Persistence';
import HandleClose from '../../services/server-socket/models/HandleClose';
import HandleConnection from '../../services/server-socket/models/HandleConnection';
import HandleEnd from '../../services/server-socket/models/HandleEnd';
import HandleError from '../../services/server-socket/models/HandleError';
import Proto1903HandlePacket from '../../services/server-socket/protocol1903/models/Proto1903HandlePacket';
import Proto1903HandleProcess from '../../services/server-socket/protocol1903/models/Proto1903HandleProcess';
import Jt808HandlePacket from '../../services/server-socket/protocol808/models/Jt808HandlePacket';
import Jt808HandleProcess from '../../services/server-socket/protocol808/models/Jt808HandleProcess';
import ProtoGt06HandlePacket from '../../services/server-socket/protocolGT06/models/ProtoGt06HandlePacket';
import ProtoGt06HandleProcess from '../../services/server-socket/protocolGT06/models/ProtoGt06HandleProcess';

export default interface  ServerSocketHandlerProps {
  protocol: "PROTO1903" | "JT808" | "GT06";
  conn: net.Socket;
  persistence: Persistence;
  handleConnection: HandleConnection;
  handleProcess: Proto1903HandleProcess | Jt808HandleProcess | ProtoGt06HandleProcess;
  handlePacket: Proto1903HandlePacket | Jt808HandlePacket | ProtoGt06HandlePacket;
  handleClose: HandleClose;
  handleEnd: HandleEnd;
  handleError: HandleError;
  getPowerProfileConfig: GetPowerProfileConfig;
  decoder: (data: Buffer) => Buffer[] | string[];
}