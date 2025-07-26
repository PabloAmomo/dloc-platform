import { printMessage } from "../../../../functions/printMessage";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreateResponse0xB3 from "./protoTopinCreateResponse0xB3";

const protoTopinProcessPacket0xB3: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} ✅ ICCID received from device (${topinPacket.informationContent.toString("ascii")})`);

  (response.response as Buffer[]).push(protoTopinCreateResponse0xB3(topinPacket));

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0xB3;
