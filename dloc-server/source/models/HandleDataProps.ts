import { HandlePacket } from "./HandlePacket";
import { Persistence } from "./Persistence";
import net from 'node:net';

export interface HandleHandlerProps {
  imei: string;
  remoteAddress: string;
  data: Buffer | String; 
  handlePacket: HandlePacket;
  persistence: Persistence;
  conn: net.Socket | { write: (arg0: string) => void; destroy: () => void };
  counter: number; 
}