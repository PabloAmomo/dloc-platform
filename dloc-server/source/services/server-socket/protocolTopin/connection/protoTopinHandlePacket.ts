import convertAnyToHexString from "../../../../functions/convertAnyToHexString";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import positionUpdateLastActivityAndAddHistory from "../../../../functions/positionUpdateLastActivityAndAddHistory";
import { printMessage } from "../../../../functions/printMessage";
import discardData from "../../functions/discardData";
import HandlePacketResult from "../../models/HandlePacketResult";
import protoTopinGetFrameData from "../functions/protoTopinGetFrameData";
import protoTopinProcessPacket0x01 from "../functions/protoTopinProcessPacket0x01";
import protoTopinProcessPacket0x08 from "../functions/protoTopinProcessPacket0x08";
import protoTopinProcessPacket0x10 from "../functions/protoTopinProcessPacket0x10";
import protoTopinProcessPacket0x11 from "../functions/protoTopinProcessPacket0x11";
import protoTopinProcessPacket0x13 from "../functions/protoTopinProcessPacket0x13";
import protoTopinProcessPacket0x14 from "../functions/protoTopinProcessPacket0x14";
import protoTopinProcessPacket0x18 from "../functions/protoTopinProcessPacket0x18";
import protoTopinProcessPacket0x19 from "../functions/protoTopinProcessPacket0x19";
import protoTopinProcessPacket0x30 from "../functions/protoTopinProcessPacket0x30";
import protoTopinProcessPacket0x57 from "../functions/protoTopinProcessPacket0x57";
import protoTopinProcessPacket0x80 from "../functions/protoTopinProcessPacket0x80";
import protoTopinProcessPacket0x99 from "../functions/protoTopinProcessPacket0x99";
import protoTopinProcessPacket0xB3 from "../functions/protoTopinProcessPacket0xB3";
import ProtoTopinHandlePacket from "../models/ProtoTopinHandlePacket";
import ProtoTopinHandlePacketProps from "../models/ProtoTopinHandlePacketProps";
import ProtoTopinProcessPacketProps from "../models/ProtoTopinProcessPacketProps";

const noImei: string = "no imei received";

const protoTopinHandlePacket: ProtoTopinHandlePacket = async (
  props: ProtoTopinHandlePacketProps
): Promise<HandlePacketResult> => {
  const { imei, remoteAddress, data, persistence, disconnect } = props;

  let updateLastActivity: boolean = false;
  let response: HandlePacketResult = {
    imei,
    error: "",
    response: [],
  };

  /** Temporal imei (Used only for print messages for user) */
  let imeiToPrint: string = getNormalizedIMEI(imei);

  /* convert data to hex string */
  const dataString: string = convertAnyToHexString(data);
  // TODO: [DEBUG] Remove this when the protocol (topin) is stable
  printMessage(`[${imeiToPrint}] (${remoteAddress}) 📡 RECEIVED 👉 [${dataString}].`);

  const topinPacket = protoTopinGetFrameData(data);

  const functionData: ProtoTopinProcessPacketProps = {
    remoteAddress,
    response,
    imei,
    topinPacket,
    persistence,
    prefix: `[${imeiToPrint}] (${remoteAddress})`,
  };

  let respProcess = {
    updateLastActivity: false,
    imei: imeiToPrint,
    mustDisconnect: false,
  };

  // ---------------------------------------
  // Login Message 0x01
  // ---------------------------------------
  if (topinPacket.protocolNumber === 0x01) respProcess = await protoTopinProcessPacket0x01(functionData);
  // ---------------------------------------
  // heartbeat 0x08
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x08) respProcess = await protoTopinProcessPacket0x08(functionData);
  // ---------------------------------------
  // Positioning data packets 0x10
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x10) respProcess = await protoTopinProcessPacket0x10(functionData);
  // ---------------------------------------
  // Positioning data packets 0x11
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x11) respProcess = await protoTopinProcessPacket0x11(functionData);
  // ---------------------------------------
  // status package 0x13
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x13) respProcess = await protoTopinProcessPacket0x13(functionData);
  // ---------------------------------------
  // status package 0x14
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x14) respProcess = await protoTopinProcessPacket0x14(functionData);
  // ---------------------------------------
  // Positioning data batch 0x18
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x18) respProcess = await protoTopinProcessPacket0x18(functionData);
  // ---------------------------------------
  // Positioning data batch 0x19
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x19) respProcess = await protoTopinProcessPacket0x19(functionData);
  // ---------------------------------------
  // update time 0x30
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x30) respProcess = await protoTopinProcessPacket0x30(functionData);
  // ---------------------------------------
  // ICCID 0x3B
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0xb3) respProcess = await protoTopinProcessPacket0xB3(functionData);
  // ---------------------------------------
  // synchronization setting data 0x57
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x57) respProcess = await protoTopinProcessPacket0x57(functionData);
  // ---------------------------------------
  // Manual position request 0x80
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x80) respProcess = await protoTopinProcessPacket0x80(functionData);
  // ---------------------------------------
  // Manual position request 0x99
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x99) respProcess = await protoTopinProcessPacket0x99(functionData);
  // ---------------------------------------------
  // Unknow command - Discart packet
  // ---------------------------------------------
  else {
    printMessage(`[${imeiToPrint}] (${remoteAddress}) 🤷‍♂️ command unknown in data 🙋`);
    printMessage(`[${imeiToPrint}] (${remoteAddress}) 🤷‍♂️ unknown 👉 👉 👉 👉 👉 👉 [${dataString}]`);
    return await discardData("commad unknown", false, persistence, imeiToPrint, remoteAddress, dataString, response);
  }

  updateLastActivity = respProcess.updateLastActivity;
  imeiToPrint = respProcess.imei;
  if (respProcess.mustDisconnect) disconnect();

  /** Update last activity and add history */
  await positionUpdateLastActivityAndAddHistory(
    imeiToPrint,
    remoteAddress,
    dataString,
    persistence,
    updateLastActivity
  );

  /** */
  if (response.response.length === 0)
    printMessage(
      `[${imeiToPrint}] (${remoteAddress}) ⚠️  no response to send for packet [${dataString.substring(0, 40)}...]`
    );
  else {
    for (let i = 0; i < response.response.length; i++) {
      printMessage(`[${imeiToPrint}] (${remoteAddress}) ✅ response [${convertAnyToHexString(response.response[i])}].`);
    }
  }

  /** Return */
  return response;
};

export default protoTopinHandlePacket;
