import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import { printMessage } from "../../../../functions/printMessage";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CreateGeneralResponse from "./jt808CreateGeneralResponse";
import jt808GetBatteryLevelPacketDateTime from "./jt808GetBatteryLevelPacketDateTime";
import jt808PrintMessage from "./jt808PrintMessage";

const jt808ProcessPacket0x0210: Jt808ProcessPacket = async ({
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

  response.imei = padNumberLeft(terminalId, 15, "0");
  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = false;

  const batteryLevel: number = body.readUInt8(0);
  const dateTime = jt808GetBatteryLevelPacketDateTime(body);
  printMessage(`[${imei}] (${remoteAddress}) 🔋 Battery level: ${batteryLevel}% at ${dateTime} 🔋`);

  await positionUpdateBatteryAndLastActivity(imei, "JT808", remoteAddress, persistence, batteryLevel);

  jt808PrintMessage(imei, remoteAddress, msgType);

  return {
    updateLastActivity,
    imei,
    mustDisconnect: false,
  };
};

export default jt808ProcessPacket0x0210;
