import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { printMessage } from "../../../../functions/printMessage";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CehckUploadPowerSaving from "./jt808CehckUploadPowerSaving";
import jt808CheckTerminalParametersResponse from "./jt808CheckTerminalParametersResponse";
import jt808CreateGeneralResponse from "./jt808CreateGeneralResponse";
import jt808ParseTerminalAttributes from "./jt808ParseTerminalAttributesBits";
import jt808PrintMessage from "./jt808PrintMessage";

// TODO: [REFACTOR] Clean up this code

const jt808ProcessPacket0x0xxx: Jt808ProcessPacket = async ({
  remoteAddress,
  response,
  jt808Packet,
  counter,
  persistence,
}) => {
  if (![0x0104].includes(jt808Packet.header.msgType)) {
    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00"
      )
    );
  }

  response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = true;

  let extraMessage = "";

  if (jt808Packet.header.msgType === 0x0104)
    await jt808CheckTerminalParametersResponse(
      imei,
      remoteAddress,
      persistence,
      jt808Packet
    );
  else if (jt808Packet.header.msgType === 0x0107) {
    const terminalAttributes = jt808ParseTerminalAttributes(jt808Packet.body);
    extraMessage = `Terminal attributes:  ⚙️  Terminal attributtes: ${terminalAttributes.manufacturerId} Model ${terminalAttributes.terminalModel} - SimIccid ${terminalAttributes.simIccid}`;
  } else if (jt808Packet.header.msgType === 0x0112) {
    const powerSaveModeData = jt808CehckUploadPowerSaving(
      jt808Packet.body,
      imei,
      remoteAddress
    );
    extraMessage = `🔋 powerSaveModeData: ${JSON.stringify(powerSaveModeData)}`;
  }

  if (extraMessage !== "")
    printMessage(`[${imei}] (${remoteAddress}) 👉 ${extraMessage}`);

  const bodyStringHex = jt808Packet.body.toString("hex");
  jt808PrintMessage(
    imei,
    remoteAddress,
    jt808Packet.header.msgType,
    bodyStringHex === "" ? "" : `body ${bodyStringHex}`
  );

  return {
    updateLastActivity,
    imei,
    mustDisconnect: jt808Packet.header.msgType === 0x0003,
  };
};

export default jt808ProcessPacket0x0xxx;
