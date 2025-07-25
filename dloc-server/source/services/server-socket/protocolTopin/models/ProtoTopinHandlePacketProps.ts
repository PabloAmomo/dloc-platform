import { Persistence } from "../../../../models/Persistence";

export default interface ProtoTopinHandlePacketProps {
  imei: string;
  remoteAddress: string;
  data: Buffer;
  persistence: Persistence;
  disconnect: () => void;
}

