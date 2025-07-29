import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

const protoTopinCreateResponse0x10 = (TopinPacket: ProtoTopinPacket, datetime: Buffer): Buffer => {
  return protoTopinCreatePacket(Buffer.from([0x08, 0x10, ...datetime]));
}

export default protoTopinCreateResponse0x10;
