import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CreateRequestSyncTimePacket from "./jt808CreateRequestSyncTimePacket";
import jt808PrintMessage from "./jt808PrintMessage";

const jt808ProcessPacket0x0109: Jt808ProcessPacket = ({
  remoteAddress,
  response,
  jt808Packet,
  counter,
}) => {
  (response.response as Buffer[]).push(
    jt808CreateRequestSyncTimePacket(
      jt808Packet.header.terminalId,
      counter,
      jt808Packet.header.msgSerialNumber
    )
  );

  response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");

  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = true;

  jt808PrintMessage(imei, remoteAddress, jt808Packet.header.msgType);

  return {
    updateLastActivity,
    imei,
  };
};

export default jt808ProcessPacket0x0109;
