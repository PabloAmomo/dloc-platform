export interface HandlePacketResult { 
  imei: string;
  error: string;
  response: any; // TODO: Limit to Buffer or string type
}