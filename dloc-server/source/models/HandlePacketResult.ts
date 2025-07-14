export interface HandlePacketResult { 
  imei: string;
  error: string;
  response: Buffer[] | String[];
  mustDisconnect: boolean;
}