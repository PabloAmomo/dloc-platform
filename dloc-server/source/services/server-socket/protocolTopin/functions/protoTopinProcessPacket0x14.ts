import { printMessage } from "../../../../functions/printMessage";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";

const protoTopinProcessPacket0x14: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} 💤 Device report go to sleep`);

  // No response is needed for this packet

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x14;
