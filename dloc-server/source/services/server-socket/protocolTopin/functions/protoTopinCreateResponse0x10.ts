import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

// TODO: Unify the responses when its posible
const protoTopinCreateResponse0x10 = (gt06Packer: ProtoTopinPacket, datetime: Buffer): Buffer => {
  return protoTopinCreatePacket(Buffer.from([0x00, 0x10, ...datetime]));
}

export default protoTopinCreateResponse0x10;
