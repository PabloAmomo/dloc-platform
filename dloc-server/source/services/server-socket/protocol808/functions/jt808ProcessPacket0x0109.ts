import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CreateRequestSyncTimePacket from "./jt808CreateRequestSyncTimePacket";
import jt808PrintMessage from "./jt808PrintMessage";

const jt808ProcessPacket0x0109: Jt808ProcessPacket = async ({
  remoteAddress,
  response,
  jt808Packet,
  counter,
  persistence,
}) => {
  const {
    body,
    header: { terminalId, msgSerialNumber, msgType },
  } = jt808Packet;

  (response.response as Buffer[]).push(jt808CreateRequestSyncTimePacket(terminalId, counter, msgSerialNumber));

  response.imei = padNumberLeft(terminalId, 15, "0");

  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = true;

  jt808PrintMessage(imei, remoteAddress, msgType);

  return {
    updateLastActivity,
    imei,
    mustDisconnect: false,
  };
};

export default jt808ProcessPacket0x0109;
