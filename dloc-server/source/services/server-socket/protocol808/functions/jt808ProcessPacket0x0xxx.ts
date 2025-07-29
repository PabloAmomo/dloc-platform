import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { printMessage } from "../../../../functions/printMessage";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CehckUploadPowerSaving from "./jt808CehckUploadPowerSaving";
import jt808CheckTerminalParametersResponse from "./jt808CheckTerminalParametersResponse";
import jt808CreateGeneralResponse from "./jt808CreateGeneralResponse";
import jt808ParseTerminalAttributes from "./jt808ParseTerminalAttributesBits";
import jt808PrintMessage from "./jt808PrintMessage";

const jt808ProcessPacket0x0xxx: Jt808ProcessPacket = async ({
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

  if (![0x0104].includes(msgType)) {
    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(terminalId, counter, msgSerialNumber, msgType, "00")
    );
  }

  response.imei = padNumberLeft(terminalId, 15, "0");
  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = true;

  let extraMessage = "";
  switch (msgType) {
    case 0x0104: {
      await jt808CheckTerminalParametersResponse(imei, remoteAddress, persistence, jt808Packet);
      break;
    }

    case 0x0105: {
      extraMessage = `Sleep ${(body.length === 1 && body[0] === 0x00) ? "🚀 wakeup" : "💤 sleep"}`;
      break;
    }

    case 0x0107: {
      const { manufacturerId, terminalModel, simIccid } = jt808ParseTerminalAttributes(jt808Packet.body);
      extraMessage = `⚙️  Terminal attributes: ${manufacturerId} Model ${terminalModel} - SimICCID ${simIccid}`;
      break;
    }

    case 0x0112: {
      const powerSaveModeData = jt808CehckUploadPowerSaving(body, imei, remoteAddress);
      extraMessage = `🔋 powerSaveModeData: ${JSON.stringify(powerSaveModeData)}`;
      break;
    }
  }

  if (extraMessage !== "") printMessage(`[${imei}] (${remoteAddress}) 👉 ${extraMessage}`);

  const bodyStringHex = body.toString("hex");
  jt808PrintMessage(imei, remoteAddress, msgType, bodyStringHex.length === 0 ? "" : `body ${bodyStringHex}`);

  return {
    updateLastActivity,
    imei,
    mustDisconnect: msgType === 0x0003,
  };
};

export default jt808ProcessPacket0x0xxx;
