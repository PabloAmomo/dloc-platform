export interface ProtoGt06Packet  {
    raw: string,
  header: {
    msgType: number;
    terminalId: string;
  };
  body: Buffer;
  checksum: {
    value: number;
    valid: boolean;
  }
}