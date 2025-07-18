import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CreateCheckParameterSettingPacket from "./jt808CreateCheckParameterSettingPacket";
import jt808CreateGeneralResponse from "./jt808CreateGeneralResponse";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";
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

  (response.response as Buffer[]).push(jt808CreateCheckParameterSettingPacket(terminalId, counter + 100, []));

  // (F102) Low battery alarm （0 off 1 on）default on
  const parametersPackets = ["0000F102 01 " + createHexFromNumberWithNBytes(0, 2)];
  (response.response as Buffer[]).push(jt808CreateParameterSettingPacket(terminalId, counter + 101, parametersPackets));

  // TODO: [REMAINDER] If this packet is activated here, remove from jt808HandleProcess
  //(response.response as Buffer[]).push(jt808CreateQueryLocationMessage(terminalId, counter + 102));

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
