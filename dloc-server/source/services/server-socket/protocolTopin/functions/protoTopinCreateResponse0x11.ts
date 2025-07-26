import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

const protoTopinCreateResponse0x11 = (TopinPacket: ProtoTopinPacket, datetime: Buffer): Buffer => {
  return protoTopinCreatePacket(Buffer.from([0x08, 0x11, ...datetime]));
}

export default protoTopinCreateResponse0x11;
