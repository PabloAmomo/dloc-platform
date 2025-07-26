import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x13(TopinPacker: ProtoTopinPacket, intervalTimeMin: number): Buffer {
  return protoTopinCreatePacket(Buffer.from([
    0x02, // Length
    0x13, // Protocol number
    intervalTimeMin, // Interval time in minutes
  ])); 
}

export default protoTopinCreateResponse0x13;
