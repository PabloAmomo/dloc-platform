import { printMessage } from "../../../../functions/printMessage";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreateResponse0x30 from "./protoTopinCreateResponse0x30";

const protoTopinProcessPacket0x30: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} ⏰ update time received. Send server date and time.`);

  (response.response as Buffer[]).push(protoTopinCreateResponse0x30(topinPacket));

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x30;
