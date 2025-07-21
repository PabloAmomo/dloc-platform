import createHexFromNumberWithNBytes from "../../../../functions/createHexFromNumberWithNBytes";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CreateCheckParameterSettingPacket from "./jt808CreateCheckParameterSettingPacket";
import jt808CreateGeneralResponse from "./jt808CreateGeneralResponse";
import jt808CreateParameterSettingPacket from "./jt808CreateParameterSettingPacket";
import jt808CreateWakeupPacket from "./jt808CreateWakeupPacket";
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

  (response.response as Buffer[]).push(
    jt808CreateGeneralResponse(terminalId, counter + 50, msgSerialNumber, msgType, "00")
  );

  // (0090) (REMOVED) Definition of GNSS positioning mode is as follows: bit0, 0: disable GPS positioning, 1: enable GPS positioning | bit1, 0: disable Beidou positioning, 1: enable Beidou positioning | bit2, 0: disable GLONASS positioning, 1: enable GLONASS positioning | bit3, 0: disable Galileo positioning, 1: enable Galileo positioning
  // (0094) Upload mode of GNSS module detailed location data: 0x00, local storage, do not upload (default); 0x01, upload in time interval; 0x02, upload in distance interval; 0x0B, upload in accumulative time, automatically stop uploading after reaching transmission time; 0x0C, upload in accumulative distance, automatically stop uploading after reaching a certain distance 0x0D, upload in accumulative number of data, automatically stop uploading after reaching the number of uploads
  // (F102) Low battery alarm （0 off 1 on）default on
  const parametersPackets = [
    // "00000090 01 " + createHexFromNumberWithNBytes(255, 1), // -> GPS, Beidu, and Galileo positioning 00001011 = 11 (Bit 0, 1 y Bit 3 )
    "00000094 01 " + createHexFromNumberWithNBytes(1, 1),
    "0000F102 01 " + createHexFromNumberWithNBytes(0, 1),
  ];
  (response.response as Buffer[]).push(jt808CreateParameterSettingPacket(terminalId, counter + 51, parametersPackets));


  (response.response as Buffer[]).push(jt808CreateWakeupPacket(terminalId, counter + 52));

  (response.response as Buffer[]).push(jt808CreateCheckParameterSettingPacket(terminalId, counter + 53, []));

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
