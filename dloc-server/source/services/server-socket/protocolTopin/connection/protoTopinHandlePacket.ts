import convertAnyToHexString from "../../../../functions/convertAnyToHexString";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import positionUpdateLastActivityAndAddHistory from "../../../../functions/positionUpdateLastActivityAndAddHistory";
import { printMessage } from "../../../../functions/printMessage";
import discardData from "../../functions/discardData";
import HandlePacketResult from "../../models/HandlePacketResult";
import protoGt06GetFrameData from "../functions/protoTopinGetFrameData";
import protoTopinProcessPacket0x01 from "../functions/protoTopinProcessPacket0x01";
import protoTopinProcessPacket0x08 from "../functions/protoTopinProcessPacket0x08";
import protoTopinProcessPacket0x13 from "../functions/protoTopinProcessPacket0x13";
import protoTopinProcessPacket0x30 from "../functions/protoTopinProcessPacket0x30";
import protoTopinProcessPacket0xB3 from "../functions/protoTopinProcessPacket0xB3";
import ProtoGt06HandlePacket from "../models/ProtoTopinHandlePacket";
import ProtoGt06HandlePacketProps from "../models/ProtoTopinHandlePacketProps";
import ProtoGt06ProcessPacketProps from "../models/ProtoTopinProcessPacketProps";

const noImei: string = "no imei received";

const protoTopinHandlePacket: ProtoGt06HandlePacket = async (
  props: ProtoGt06HandlePacketProps
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
  // TODO: [DEBUG] Only for debug
  printMessage(`[${imeiToPrint}] (${remoteAddress}) 📡 RECEIVED 👉 [${dataString}].`);

  const topinPacket = protoGt06GetFrameData(data);

  const functionData: ProtoGt06ProcessPacketProps = {
    remoteAddress,
    response,
    imei,
    topinPacket,
    persistence,
    prefix: `[${imeiToPrint}] (${remoteAddress})`,
  };

  // ---------------------------------------
  // Login Message 0x01
  // ---------------------------------------
  if (topinPacket.protocolNumber === 0x01) {
    const respProcess = await protoTopinProcessPacket0x01(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

  // ---------------------------------------
  // heartbeat 0x08
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x08) {
    const respProcess = await protoTopinProcessPacket0x08(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

  // ---------------------------------------
  // status package 0x13
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x13) {
    const respProcess = await protoTopinProcessPacket0x13(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

  // ---------------------------------------
  // update time 0x30
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0x30) {
    const respProcess = await protoTopinProcessPacket0x30(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

  // ---------------------------------------
  // ICCID 0x3B
  // ---------------------------------------
  else if (topinPacket.protocolNumber === 0xB3) {
    const respProcess = await protoTopinProcessPacket0xB3(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }


  // ---------------------------------------
  // Positioning data batch upload（0x0704）
  // Location information query 0x0201）
  // Location report（0x0200）
  //     response 0x8001
  // ---------------------------------------
  //else if ([0x0704, 0x0201, 0x0200].includes(jt808Packet.header.msgType)) {
  //  const respProcess = await jt808ProcessPacket0x0xxxLocations(functionData);
  //  updateLastActivity = respProcess.updateLastActivity;
  //  imeiToPrint = respProcess.imei;
  //}

  // ---------------------------------------
  // Battery level update when sleep（0x0210）
  //     response 0x8001
  // ---------------------------------------
  //else if (jt808Packet.header.msgType === 0x0210) {
  //  const respProcess = await jt808ProcessPacket0x0210(functionData);
  //  updateLastActivity = respProcess.updateLastActivity;
  //  imeiToPrint = respProcess.imei;
  //}

  // ---------------------------------------
  // Terminal heartbeat（0x0002）
  // Terminal Logout（0x0003）
  // Check terminal parameter（0x0104）
  // Sleep notification（0x0105）
  // Check terminal attribute（0x0107）
  // Sleep wake up notification（0x0108）
  // Unknown command 10 07（0x1007）
  // Upload the power saving (0x0112)
  //     response 0x8001
  // ---------------------------------------
  //else if ([0x0002, 0x0003, 0x0104, 0x0105, 0x0107, 0x0108, 0x0112, 0x1007].includes(jt808Packet.header.msgType)) {
  //  const respProcess = await jt808ProcessPacket0x0xxx(functionData);
  //  updateLastActivity = respProcess.updateLastActivity;
  //  imeiToPrint = respProcess.imei;
  //  if (respProcess.mustDisconnect) disconnect();
  //}

  // ---------------------------------------
  // Terminal general response（0x0001）
  // ---------------------------------------
  //else if ([0x0001].includes(jt808Packet.header.msgType)) {
  //  const respProcess = await jt808ProcessPacket0x0001(functionData);
  //  updateLastActivity = respProcess.updateLastActivity;
  //  imeiToPrint = respProcess.imei;
  //}

  // ---------------------------------------------
  // Unknow command - Discart packet
  // ---------------------------------------------
  else {
    printMessage(`[${imeiToPrint}] (${remoteAddress}) 🤷‍♂️ command unknown in data ⚠️  [${dataString}]  ⚠️`);

    return await discardData("commad unknown", false, persistence, imeiToPrint, remoteAddress, dataString, response);
  }

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
