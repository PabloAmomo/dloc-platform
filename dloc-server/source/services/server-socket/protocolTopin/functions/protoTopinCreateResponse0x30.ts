import { ProtoTopinPacket } from "../models/ProtoTopinPacket";
import protoTopinCreatePacket from "./protoTopinCreatePacket";

function protoTopinCreateResponse0x30(TopinPacker: ProtoTopinPacket): Buffer {
  const dateTime = new Date();
  const year = dateTime.getFullYear() - 2000; // Year offset for Topin protocol
  const month = dateTime.getMonth() + 1; // Months are 0-indexed in JavaScript
  const day = dateTime.getDate();
  const hours = dateTime.getHours();
  const minutes = dateTime.getMinutes();
  const seconds = dateTime.getSeconds();
  const responsePayload = Buffer.from([
    0x07,
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
