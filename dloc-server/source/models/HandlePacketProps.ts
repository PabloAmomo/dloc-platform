import { Persistence } from "./Persistence";

export interface HandlePacketProps {
  imei: string;
  remoteAdd: string;
  data: string;
  persistence: Persistence;
}

