import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

// TODO: Unify the responses when its posible

// TODO: Unify with protoTopinProcessPacket0x10
const protoTopinCreateResponse0x18 = (TopinPacket: ProtoTopinPacket, datetime: Buffer): Buffer => {
  return protoTopinCreatePacket(Buffer.from([0x08, 0x10, ...datetime]));
}

export default protoTopinCreateResponse0x18;
