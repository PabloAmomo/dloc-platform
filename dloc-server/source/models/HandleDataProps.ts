import { HandlePacket } from "./HandlePacket";
import { Persistence } from "./Persistence";
import net from 'node:net';

export interface HandleDataProps {
  imei: string;
  remoteAddress: string;
  data: any; // TODO: Limit to Buffer or string type
  handlePacket: HandlePacket;
  persistence: Persistence;
  conn: net.Socket | { write: (arg0: string) => void; destroy: () => void };
}