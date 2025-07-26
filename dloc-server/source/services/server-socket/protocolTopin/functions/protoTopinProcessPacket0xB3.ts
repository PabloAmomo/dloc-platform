import { printMessage } from "../../../../functions/printMessage";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";

const protoTopinProcessPacket0xB3: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} ✅ ICCID received from device (${topinPacket.informationContent.toString('ascii')})`);

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0xB3;
