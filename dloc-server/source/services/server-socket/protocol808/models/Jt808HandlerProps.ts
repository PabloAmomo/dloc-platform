import { Persistence } from "../../../../models/Persistence";
import net from 'node:net';
import { Jt808HandlePacket } from "./Jt808HandlePacket";

export interface Jt808HandlerProps {
  imei: string;
  remoteAddress: string;
  data: Buffer; 
  handlePacket: Jt808HandlePacket;
  persistence: Persistence;
  conn: net.Socket | { write: (arg0: string) => void; destroy: () => void };
  counter: number; 
}