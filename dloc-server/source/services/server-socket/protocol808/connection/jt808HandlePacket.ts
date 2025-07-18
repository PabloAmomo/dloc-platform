import convertAnyToHexString from "../../../../functions/convertAnyToHexString";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import positionUpdateLastActivityAndAddHistory from "../../../../functions/positionUpdateLastActivityAndAddHistory";
import { printMessage } from "../../../../functions/printMessage";
import discardData from "../../functions/discardData";
import HandlePacketResult from "../../models/HandlePacketResult";
import jt808GetFrameData from "../functions/jt808GetFrameData";
import jt808ProcessPacket0x0001 from "../functions/jt808ProcessPacket0x0001";
import jt808ProcessPacket0x0100 from "../functions/jt808ProcessPacket0x0100";
import jt808ProcessPacket0x0102 from "../functions/jt808ProcessPacket0x0102";
import jt808ProcessPacket0x0109 from "../functions/jt808ProcessPacket0x0109";
import jt808ProcessPacket0x0210 from "../functions/jt808ProcessPacket0x0210";
import jt808ProcessPacket0x0xxx from "../functions/jt808ProcessPacket0x0xxx";
import jt808ProcessPacket0x0xxxLocations from "../functions/jt808ProcessPacket0x0xxxLocations";
import Jt808HandlePacket from "../models/Jt808HandlePacket";
import Jt808HandlePacketProps from "../models/Jt808HandlePacketProps";
import Jt808ProcessPacketProps from "../models/Jt808ProcessPacketPropss";

const jt808HandlePacket: Jt808HandlePacket = async (props: Jt808HandlePacketProps): Promise<HandlePacketResult> => {
  const { imei, remoteAddress, data, persistence, counter, disconnect } = props;

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

  const jt808Packet = jt808GetFrameData(data);

  const functionData: Jt808ProcessPacketProps = {
    remoteAddress,
    response,
    jt808Packet,
    counter,
    persistence,
  };

  // ---------------------------------------
  // Terminal registration（0x0100)
  //     response 0x8100
  // ---------------------------------------
  if (jt808Packet.header.msgType === 0x0100) {
    const respProcess = await jt808ProcessPacket0x0100(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

  // ---------------------------------------
  // Terminal authentication（0x0102)
  //     response 0x8001
  // ---------------------------------------
  else if (jt808Packet.header.msgType === 0x0102) {
    const respProcess = await jt808ProcessPacket0x0102(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

  // ---------------------------------------
  // Positioning data batch upload（0x0704）
  // Location information query 0x0201）
  // Location report（0x0200）
  //     response 0x8001
  // ---------------------------------------
  else if ([0x0704, 0x0201, 0x0200].includes(jt808Packet.header.msgType)) {
    const respProcess = await jt808ProcessPacket0x0xxxLocations(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

  // ---------------------------------------
  // Request synchronization time（0x0109）
  //     response 0x8109
  // ---------------------------------------
  else if (jt808Packet.header.msgType === 0x0109) {
    const respProcess = await jt808ProcessPacket0x0109(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

  // ---------------------------------------
  // Battery level update when sleep（0x0210）
  //     response 0x8001
  // ---------------------------------------
  else if (jt808Packet.header.msgType === 0x0210) {
    const respProcess = await jt808ProcessPacket0x0210(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

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
  else if ([0x0002, 0x0003, 0x0104, 0x0105, 0x0107, 0x0108, 0x0112, 0x1007].includes(jt808Packet.header.msgType)) {
    const respProcess = await jt808ProcessPacket0x0xxx(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
    if (respProcess.mustDisconnect) disconnect();
  }

  // ---------------------------------------
  // Terminal general response（0x0001）
  // ---------------------------------------
  else if ([0x0001].includes(jt808Packet.header.msgType)) {
    const respProcess = await jt808ProcessPacket0x0001(functionData);
    updateLastActivity = respProcess.updateLastActivity;
    imeiToPrint = respProcess.imei;
  }

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

export default jt808HandlePacket;
