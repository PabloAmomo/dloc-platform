import { health } from "../../../../models/Persistence";
import { createPositionPacket } from "../../../../functions/createPositionPacket";
import { getUtcDateTime } from "../../../../functions/getUtcDateTime";
import { HandlePacket } from "../../../../models/HandlePacket";
import { HandlePacketProps } from "../../../../models/HandlePacketProps";
import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { PositionPacket } from "../../../../models/PositionPacket";
import { printMessage } from "../../../../functions/printMessage";
import { REGEX_PACKETS } from "../../../../functions/packetParseREGEX";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import getValuesFromStringByRegexs from "../../../../functions/getValuesFromStringByRegex";
import discardData from "../../../../functions/discardData";
import getLbsPosition from "../../../../functions/getLbsPosition";
import positionUpdateLastActivityAndAddHistory from "../../../../functions/positionUpdateLastActivityAndAddHistory";
import positionAddPositionAndUpdateDevice from "../../../../functions/positionAddPositionAndUpdateDevice";
import positionUpdateBattertAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import {
  getNormalizedIMEI,
  NO_IMEI_STRING,
} from "../../../../functions/getNormalizedIMEI";
import convertStringToHexString from "../../../../functions/convertStringToHexString";

import numberToHexByteArray from "../../../../functions/numberToHexByteArray";
import byteArrayToHexString from "../../../../functions/byteArrayToHexString";
import padNumberLeft from "../../../../functions/padNumberLeft";

import huabaoTimeSyncBody from "../functions/huabaoTimeSyncBody";
import toHexWith from "../../../../functions/toHexWith";
import huabaoGetFrameData from "../functions/huabaoGetFrameData";
import huabaoCreateGeneralResponse from "../functions/huabaoCreateGeneralResponse";
import huabaoCreateQueryLocationMessage from "../functions/huabaoCreateQueryLocationMessage";
import huabaoDecodeLocations from "../functions/huabaoDecodeLocations";
import huabaoDecodeLocationReport from "../functions/huabaoDecodeLocationReport";
import { huabaoCreateFrameData } from "../functions/huabaoCreateFrameData";


const noImei: string = "no imei received";

const handlePacket: HandlePacket = async (
  props: HandlePacketProps
): Promise<HandlePacketResult> => {
  const {
    imei,
    remoteAddress: remoteAddress,
    data,
    persistence,
    counter,
  } = props;

  const dataBuffer: Buffer = data as Buffer;

  let updateLastActivity: boolean = false;
  let response: HandlePacketResult = {
    imei,
    error: "",
    response: [],
  };

  /** Temporal imei (Used only for print messages for user) */
  var imeiTemp: string = getNormalizedIMEI(imei);

  /* convert data to hex string */
  const dataString: string = convertStringToHexString(data);
  printMessage(
    `[${imeiTemp}] (${remoteAddress}) 📡 PACKET RECEIVED oOo ----> [${dataString}].`
  );

  let huabaoPacket = huabaoGetFrameData(dataBuffer);

  // ---------------------------------------
  // Terminal registration（0x0100)
  //     response 0x8100
  // ---------------------------------------
  if (huabaoPacket.header.msgType === 0x0100) {
    (response.response as Buffer[]).push(
      huabaoCreateGeneralResponse(
        huabaoPacket.header.terminalId,
        counter,
        huabaoPacket.header.msgSerialNumber,
        huabaoPacket.header.msgType,
        "00" + huabaoPacket.header.terminalId
      )
    );

    // TODO: Enviar configuración inicial al dispositivo

    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    updateLastActivity = true;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Terminal registration successful`
    );
  }

  // ---------------------------------------
  // Terminal authentication（0x0102)
  //     response 0x8001
  // ---------------------------------------
  else if (huabaoPacket.header.msgType === 0x0102) {
    (response.response as Buffer[]).push(
      huabaoCreateGeneralResponse(
        huabaoPacket.header.terminalId,
        counter,
        huabaoPacket.header.msgSerialNumber,
        huabaoPacket.header.msgType,
        "00"
      )
    );

    (response.response as Buffer[]).push(
      huabaoCreateQueryLocationMessage(
        huabaoPacket.header.terminalId,
        counter + 100
      )
    );

    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    updateLastActivity = true;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Terminal authentication successful`
    );
  }

  // ---------------------------------------
  // Positioning data batch upload（0x0704）
  // Location information query response（0x0201）
  //     response 0x8001
  // ---------------------------------------
  else if (
    huabaoPacket.header.msgType === 0x0704 ||
    huabaoPacket.header.msgType === 0x0201
  ) {
    const locations = huabaoDecodeLocations(
      huabaoPacket.body,
      huabaoPacket.header.msgType === 0x0704
    );

    // TODO: Tratar las locations

    (response.response as Buffer[]).push(
      huabaoCreateGeneralResponse(
        huabaoPacket.header.terminalId,
        counter,
        huabaoPacket.header.msgSerialNumber,
        huabaoPacket.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    updateLastActivity = true;
    if (huabaoPacket.header.msgType === 0x0704) {
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ✅ Positioning data batch upload successful`
      );
    }
    if (huabaoPacket.header.msgType === 0x0201) {
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ✅ Location information query response successful`
      );
    }
  }

  // ---------------------------------------
  // Location report（0x0200）
  //     response 0x8001
  // ---------------------------------------
  else if (huabaoPacket.header.msgType === 0x0200) {
    const location = huabaoDecodeLocationReport(huabaoPacket.body);

    // TODO: Tratar las location

    (response.response as Buffer[]).push(
      huabaoCreateGeneralResponse(
        huabaoPacket.header.terminalId,
        counter,
        huabaoPacket.header.msgSerialNumber,
        huabaoPacket.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    updateLastActivity = true;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Positioning Location report successful`
    );
  }

  // ---------------------------------------
  // Request synchronization time（0x0109）
  //     response 0x8109 (With time sync body)
  // ---------------------------------------
  else if (huabaoPacket.header.msgType === 0x0109) {
    (response.response as Buffer[]).push(
      huabaoCreateFrameData({
        msgType: 0x8109,
        terminalId: Buffer.from(huabaoPacket.header.terminalId, "hex"),
        msgSerialNumber: counter,
        body: Buffer.from(
          byteArrayToHexString(
            numberToHexByteArray(huabaoPacket.header.msgSerialNumber)
          ) +
            toHexWith(huabaoPacket.header.msgType, 4) +
            huabaoTimeSyncBody().toString("hex"),
          "hex"
        ),
      })
    );

    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    updateLastActivity = true;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Request synchronization time successful`
    );
  }

  // ---------------------------------------
  // Battery level update when sleep（0x0210）
  //     response 0x8001
  // ---------------------------------------
  else if (huabaoPacket.header.msgType === 0x0210) {
    const batteryPercent: number = huabaoPacket.body.readUInt8(0);
    const date: string =
      "20" +
      huabaoPacket.body.readUInt8(1) +
      "-" +
      huabaoPacket.body.readUInt8(2) +
      "-" +
      huabaoPacket.body.readUInt8(3);
    const time: string =
      huabaoPacket.body.readUInt8(4) +
      ":" +
      huabaoPacket.body.readUInt8(5) +
      ":" +
      huabaoPacket.body.readUInt8(6);

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Battery level: ${batteryPercent}% at ${date} ${time}`
    );

    (response.response as Buffer[]).push(
      huabaoCreateGeneralResponse(
        huabaoPacket.header.terminalId,
        counter,
        huabaoPacket.header.msgSerialNumber,
        huabaoPacket.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    await positionUpdateBattertAndLastActivity(
      imeiTemp,
      remoteAddress,
      persistence,
      batteryPercent
    );

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Battery level update when sleep successful`
    );
  }

  // ---------------------------------------
  // Terminal heartbeat（0x0002）
  //     response 0x8001
  // ---------------------------------------
  else if (huabaoPacket.header.msgType === 0x0002) {
    (response.response as Buffer[]).push(
      huabaoCreateGeneralResponse(
        huabaoPacket.header.terminalId,
        counter,
        huabaoPacket.header.msgSerialNumber,
        huabaoPacket.header.msgType,
        "00"
      )
    );

    (response.response as Buffer[]).push(
      huabaoCreateQueryLocationMessage(
        huabaoPacket.header.terminalId,
        counter + 100
      )
    );

    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    updateLastActivity = true;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Terminal heartbeat successful`
    );
  }

  // ---------------------------------------
  // Sleep notification（0x0105）
  // Sleep wake up notification（0x0108）
  //     response 0x8001
  // ---------------------------------------
  else if (
    huabaoPacket.header.msgType === 0x0105 ||
    huabaoPacket.header.msgType === 0x0108
  ) {
    (response.response as Buffer[]).push(
      huabaoCreateGeneralResponse(
        huabaoPacket.header.terminalId,
        counter,
        huabaoPacket.header.msgSerialNumber,
        huabaoPacket.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    const bodyString = huabaoPacket.body.toString("hex");

    updateLastActivity = true;
    if (huabaoPacket.header.msgType === 0x0105) {
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ✅ Sleep notification successful ${bodyString}`
      );
    }
    if (huabaoPacket.header.msgType === 0x0108) {
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ✅ Sleep wake up notification successful ${bodyString}`
      );
    }
  }

  // ---------------------------------------
  // Terminal Logout（0x0003）
  //     response NONE
  // ---------------------------------------
  else if (huabaoPacket.header.msgType === 0x0003) {
    response.imei = padNumberLeft(huabaoPacket.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    const bodyString = huabaoPacket.body.toString("hex");

    // TODO: Desconectar el dispositivo (conn.close)

    updateLastActivity = true;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Terminal Logout successful ${bodyString}`
    );
  }

  //  const packetType = data.startsWith("TRVYP14") ? "TRVYP14" : "TRVYP15";
  //
  //  /** Process GPS data */
  //  let { values, regexIndex } = getValuesFromStringByRegexs(
  //    data,
  //    REGEX_PACKETS
  //  );
  //  if (regexIndex != -1)
  //    printMessage(
  //      `[${imeiTemp}] (${remoteAddress}) ℹ️ process data (REGEX ${regexIndex}) [${
  //        data.split(",")[0]
  //      }]`
  //    );
  //
  //  /** imei not received */
  //  if (response.imei == "")
  //    return await discardData(
  //      noImei,
  //      true,
  //      persistence,
  //      imeiTemp,
  //      remoteAddress,
  //      data,
  //      response
  //    );
  //
  //  /** Create position packet and persist */
  //  const positionPacket: PositionPacket | undefined = createPositionPacket(
  //    response.imei,
  //    remoteAddress,
  //    values,
  //    GpsAccuracy.unknown,
  //    "{}"
  //  );
  //
  //  /** Check if position packet was created */
  //  if (!positionPacket)
  //    return await discardData(
  //      "error creating position packet",
  //      false,
  //      persistence,
  //      imeiTemp,
  //      remoteAddress,
  //      data,
  //      response
  //    );
  //
  //  /** Update last activity */
  //  updateLastActivity = true;
  //
  //  if (!positionPacket.valid) {
  //    /** Invalid position, try to get position from LBS */
  //    printMessage(
  //      `[${imeiTemp}] (${remoteAddress}) ⚠️ invalid position (NOT 'A') [${
  //        data.split(",")[0]
  //      }]`
  //    );
  //
  //    /** LBS query */
  //    const lbsGetResponse = await getLbsPosition(
  //      data,
  //      packetType,
  //      persistence,
  //      imeiTemp,
  //      remoteAddress,
  //      response
  //    );
  //    if ("error" in lbsGetResponse && lbsGetResponse.error)
  //      return lbsGetResponse;
  //
  //    /** Process LBS data */
  //    if ("location" in lbsGetResponse) {
  //      positionPacket.lat = lbsGetResponse.location.lat;
  //      positionPacket.lng = lbsGetResponse.location.lng;
  //      positionPacket.valid = true;
  //      positionPacket.accuracy = GpsAccuracy.lbs;
  //    }
  //  }
  //
  //  /** Add position and update device */
  //  if (positionPacket.valid) {
  //    let oldPacket: boolean = false;
  //    const oldPacketMessage = "old packet";
  //
  //    await positionAddPositionAndUpdateDevice(
  //      imeiTemp,
  //      remoteAddress,
  //      positionPacket,
  //      persistence,
  //      () => {},
  //      (error) => {
  //        oldPacket = error?.message === "old packet";
  //      }
  //    );
  //
  //    if (oldPacket)
  //      await discardData(
  //        oldPacketMessage,
  //        true,
  //        persistence,
  //        imeiTemp,
  //        remoteAddress,
  //        data,
  //        response
  //      );
  //  }
  //
  //  response.response = `TRVZP${data.substring(5, 7)}#`;
  //}

  // ---------------------------------------------
  // Response to TRVAP14 packet (LBS)
  // ---------------------------------------------
  //else if (data.startsWith("TRVAP14")) {
  //  const packetType = "TRVAP14";
  //
  //  if (response.imei == "")
  //    return await discardData(
  //      noImei,
  //      true,
  //      persistence,
  //      imeiTemp,
  //      remoteAddress,
  //      data,
  //      response
  //    );
  //
  //  /** LBS query */
  //  const lbsGetResponse = await getLbsPosition(
  //    data,
  //    packetType,
  //    persistence,
  //    imeiTemp,
  //    remoteAddress,
  //    response
  //  );
  //  if ("error" in lbsGetResponse && lbsGetResponse.error)
  //    return lbsGetResponse;
  //
  //  /** Process LBS data */
  //  if ("location" in lbsGetResponse) {
  //    const { lat, lng } = lbsGetResponse.location;
  //    response.response = `TRVBP14,${lat.toFixed(5)},${lng.toFixed(5)}#`;
  //  } else {
  //    response.response = `TRVBP${data.substring(5, 7)}#`;
  //  }
  //}

  // ---------------------------------------------
  // UNKNOW but need response (TRVAP Packets)
  // ---------------------------------------------
  //else if (data.startsWith("TRVAP89")) {
  //  if (response.imei == "")
  //    return await discardData(
  //      noImei,
  //      true,
  //      persistence,
  //      imeiTemp,
  //      remoteAddress,
  //      data,
  //      response
  //    );
  //
  //  response.response = `TRVBP${data.substring(5, 7)}#`;
  //}

  // ------------------------------------------------
  // Packets with not response needed
  // TRVCP03: Set heartbeat packet interval
  // TRVXP02: Set upload interval
  // TRVAP92: Set LED display switch
  // ------------------------------------------------
  //else if (
  //  data.startsWith("TRVCP03") ||
  //  data.startsWith("TRVXP02") ||
  //  data.startsWith("TRVAP92")
  //) {
  //  let message: string = "";
  //  const resultVal: string = data.endsWith("0#") ? "OK" : "ERROR";
  //
  //  if (data.startsWith("TRVCP03")) message = "Set heartbeat packet interval";
  //  if (data.startsWith("TRVXP02")) message = "Set Upload interval";
  //  if (data.startsWith("TRVAP92")) message = "Set Led display switch";
  //
  //  printMessage(
  //    `[${imeiTemp}] (${remoteAddress}) 👍 confirmation from device [${data}] (${message} ${resultVal})`
  //  );
  //}

  // ------------------------------------------------
  // Response to TRVWP02 config packet (Only Info)
  // ------------------------------------------------
  //else if (data.startsWith("TRVXP020000010")) {
  //  updateLastActivity = true;
  //  printMessage(
  //    `[${
  //      imeiTemp == "" ? NO_IMEI_STRING : response.imei
  //    }] (${remoteAddress}) 👌 confirmed TRVWP02 packet received`
  //  );
  //}

  // ---------------------------------------------
  // Unknow command - Discart packet
  // ---------------------------------------------
  else {
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 🤷‍♂️ command unknown in data [${
        dataString.length > 20
          ? dataString.substring(0, 20) + "..."
          : dataString
      }]`
    );
    return await discardData(
      "commad unknown",
      false,
      persistence,
      imeiTemp,
      remoteAddress,
      dataString,
      response
    );
  }

  /** Update last activity and add history */
  await positionUpdateLastActivityAndAddHistory(
    imeiTemp,
    remoteAddress,
    dataString,
    persistence,
    updateLastActivity
  );

  /** */
  if (response.response.length === 0) {
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ❌ no response to send for packet [${dataString}]`
    );
  } else {
    for (let i = 0; i < response.response.length; i++) {
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ✅ response [${convertStringToHexString(
          response.response[i]
        )}].`
      );
    }
  }

  /** Return */
  return response;
};

export { handlePacket };
