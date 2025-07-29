import net from "node:net";

import { Persistence } from "../../models/Persistence";
import HandleConnection from "../../services/server-socket/models/HandleConnection";
import ServerSocketHandlerPropsInjection from "./ServerSocketHandlerPropsInjection";

export default interface ServerSocketHandlerProps extends ServerSocketHandlerPropsInjection {
  conn: net.Socket;
  persistence: Persistence;
  handleConnection: HandleConnection;
}
