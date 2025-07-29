import { printMessage } from "../../../../functions/printMessage";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";

const protoTopinProcessPacket0x99: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} 🚨 Alarm received from device 🚨`);

  // No need to create a response for this packet, just log the alarm

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x99;
