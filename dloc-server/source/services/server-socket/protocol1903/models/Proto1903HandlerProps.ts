import { Persistence } from "../../../../models/Persistence";
import net from 'node:net';
import { Proto1903HandlePacket } from "./Proto1903HandlePacket";

export interface Proto1903HandlerProps {
  imei: string;
  remoteAddress: string;
  data: String; 
  handlePacket: Proto1903HandlePacket;
  persistence: Persistence;
  conn: net.Socket | { write: (arg0: string) => void; destroy: () => void };
  counter: number; 
}