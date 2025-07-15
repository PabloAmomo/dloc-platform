export default interface HandlePacketResult { 
  imei: string;
  error: string;
  response: Buffer[] | String[];
}