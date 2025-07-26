import getDateTimeValues from "../../../../functions/getDateTimeValues";
import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x30(TopinPacket: ProtoTopinPacket): Buffer {
  const { year, month, day, hours, minutes, seconds  } = getDateTimeValues(new Date(), true);

  const responsePayload = Buffer.from([
    0x08,
    0x30, 
    year, // Year
    month, // Month
    day, // Day
    hours, // Hours
    minutes, // Minutes
    seconds, // Seconds
  ]);
  return protoTopinCreatePacket(responsePayload); 
}

export default protoTopinCreateResponse0x30;
