export interface Jt808Packet  {
    raw: string,
  header: {
    msgType: number;
    msgProp: number;
    bodyLength: number;
    isSegmented: boolean;
    encryptionType: number;
    terminalId: string;
    msgSerialNumber: number;
    packetInfo: { totalPackets: number; packetIndex: number } | null;
  };
  body: Buffer;
  checksum: {
    value: number;
    valid: boolean;
  }
}