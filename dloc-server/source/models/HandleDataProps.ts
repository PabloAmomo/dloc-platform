import { HandlePacket } from "./HandlePacket";
import { Persistence } from "./Persistence";
import net from 'node:net';

export interface HandleDataProps {
  imei: string;
  remoteAdd: string;
  data: string;
  handlePacket: HandlePacket;
  persistence: Persistence;
  conn: net.Socket | { write: (arg0: string) => void; destroy: () => void };
}