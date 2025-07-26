import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoGt06CreateResponse0x01 from "./protoTopinCreateResponse0x01";

const protoTopinProcessPacket0x01: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  const imei = topinPacket.informationContent.slice(0, 8).toString("hex").slice(-15);

  response.imei = padNumberLeft(imei, 15, "0");
  response.imei = getNormalizedIMEI(response.imei);

  const softVersion = topinPacket.informationContent.slice(-1).readUInt8(0);
  (response.response as Buffer[]).push(protoGt06CreateResponse0x01(topinPacket, softVersion));

  return {
    updateLastActivity: true,
    imei: getNormalizedIMEI(imei),
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x01;
