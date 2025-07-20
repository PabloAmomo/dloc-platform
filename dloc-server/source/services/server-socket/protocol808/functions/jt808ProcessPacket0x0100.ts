import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { printMessage } from "../../../../functions/printMessage";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";
import jt808CreateTerminalRegistrationResponsePacket from "./jt808CreateTerminalRegistrationResponsePacket";
import jt808PrintMessage from "./jt808PrintMessage";

const jt808ProcessPacket0x0100: Jt808ProcessPacket = async ({
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

  (response.response as Buffer[]).push(
    jt808CreateTerminalRegistrationResponsePacket(terminalId, counter, msgSerialNumber)
  );

  response.imei = padNumberLeft(terminalId, 15, "0");
  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = true;

  // Terminal time zone (0x00 = UTC)
  (response.response as Buffer[]).push(
    jt808CreateParameterSettingPacket(terminalId, counter + 100, ["0000F142 01 00"])
  );
  printMessage(`[${imei}] (${remoteAddress}) 🌎 Time zone to 0 packet sent (Device will restart)`);

  jt808PrintMessage(imei, remoteAddress, msgType);

  return {
    updateLastActivity,
    imei,
    mustDisconnect: true, // Must disconnect to apply the time zone change
  };
};

export default jt808ProcessPacket0x0100;
