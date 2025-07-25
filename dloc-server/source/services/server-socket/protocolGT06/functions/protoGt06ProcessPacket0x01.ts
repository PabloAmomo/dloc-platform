import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { ProtoGt06ProcessPacket } from "../models/ProtoGt06ProcessPacket";
import protoGt06CreateResponse0x01 from "./protoGt06CreateResponse0x01";

const protoGt06ProcessPacket0x01: ProtoGt06ProcessPacket = async ({
  remoteAddress,
  response,
  gt06Packet,
  persistence,
  prefix,
}) => {
  const imei = gt06Packet.informationContent.toString("utf8");

  response.imei = padNumberLeft(imei, 15, "0");
  response.imei = getNormalizedIMEI(imei);

  (response.response as Buffer[]).push(protoGt06CreateResponse0x01(gt06Packet));

  return {
    updateLastActivity: true,
    imei: getNormalizedIMEI(imei),
    mustDisconnect: false,
  };
};

export default protoGt06ProcessPacket0x01;
