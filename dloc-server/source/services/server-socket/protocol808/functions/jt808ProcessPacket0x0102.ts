import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CreateCheckParameterSettingPacket from "./jt808CreateCheckParameterSettingPacket";
import jt808CreateGeneralResponse from "./jt808CreateGeneralResponse";
import jt808CreateQueryLocationMessage from "./jt808CreateQueryLocationMessage";
import jt808PrintMessage from "./jt808PrintMessage";

const jt808ProcessPacket0x0102: Jt808ProcessPacket = async ({
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

  (response.response as Buffer[]).push(jt808CreateGeneralResponse(terminalId, counter, msgSerialNumber, msgType, "00"));

  (response.response as Buffer[]).push(jt808CreateQueryLocationMessage(terminalId, counter + 100));

  (response.response as Buffer[]).push(jt808CreateCheckParameterSettingPacket(terminalId, counter + 102, []));

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

export default jt808ProcessPacket0x0102;
