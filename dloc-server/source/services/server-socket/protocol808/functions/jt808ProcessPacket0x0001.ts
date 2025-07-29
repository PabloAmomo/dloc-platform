import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import toHexWith from "../../../../functions/toHexWith";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808ParseCommonResultFromTerminal from "./jt808ParseCommonResultFromTerminal";
import jt808PrintMessage from "./jt808PrintMessage";

const jt808ProcessPacket0x0001: Jt808ProcessPacket = async ({
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

  response.imei = padNumberLeft(terminalId, 15, "0");
  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = true;

  const reponseCommon = jt808ParseCommonResultFromTerminal(body);

  const extraData = `${reponseCommon.responseToMsgSerialNumber} [${toHexWith(
    reponseCommon.responseToMsgSerialNumber,
    4
  )}] -> result: ${reponseCommon.result == "success" ? "✅" : "❌"} ${reponseCommon.result} (${
    reponseCommon.msgSerialNumber
  })`;

  jt808PrintMessage(imei, remoteAddress, msgType, extraData);

  return {
    updateLastActivity,
    imei,
    mustDisconnect: false,
  };
};

export default jt808ProcessPacket0x0001;
