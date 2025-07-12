import { health } from "../../../../models/Persistence";
import { getUtcDateTime } from "../../../../functions/getUtcDateTime";
import { HandlePacket } from "../../../../models/HandlePacket";
import { HandlePacketProps } from "../../../../models/HandlePacketProps";
import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { PositionPacket } from "../../../../models/PositionPacket";
import { printMessage } from "../../../../functions/printMessage";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import discardData from "../../../../functions/discardData";
import positionUpdateLastActivityAndAddHistory from "../../../../functions/positionUpdateLastActivityAndAddHistory";
import positionAddPositionAndUpdateDevice from "../../../../functions/positionAddPositionAndUpdateDevice";
import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import {
  getNormalizedIMEI,
  NO_IMEI_STRING,
} from "../../../../functions/getNormalizedIMEI";
import convertStringToHexString from "../../../../functions/convertStringToHexString";

import numberToHexByteArray from "../../../../functions/numberToHexByteArray";
import byteArrayToHexString from "../../../../functions/byteArrayToHexString";
import padNumberLeft from "../../../../functions/padNumberLeft";

import jt808TimeSyncBody from "../functions/jt808TimeSyncBody";
import toHexWith from "../../../../functions/toHexWith";
import jt808GetFrameData from "../functions/jt808GetFrameData";
import jt808CreateGeneralResponse from "../functions/jt808CreateGeneralResponse";
import jt808CreateQueryLocationMessage from "../functions/jt808CreateQueryLocationMessage";
import jt808DecodeLocations from "../functions/jt808DecodeLocations";
import jt808DecodeLocationReport from "../functions/jt808DecodeLocationReport";
import jt808CreateFrameData from "../functions/jt808CreateFrameData";
import jt808CreateTerminalAttributesMessage from "../functions/jt808CreateTerminalAttributesMessage";
import jt808ParseTerminalAttributes from "../functions/jt808ParseTerminalAttributesBits";

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

  let jt808Packet = jt808GetFrameData(dataBuffer);

  // ---------------------------------------
  // Terminal registration（0x0100)
  //     response 0x8100
  // ---------------------------------------
  if (jt808Packet.header.msgType === 0x0100) {
    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00" + jt808Packet.header.terminalId
      )
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
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
  else if (jt808Packet.header.msgType === 0x0102) {
    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00"
      )
    );

    (response.response as Buffer[]).push(
      jt808CreateQueryLocationMessage(
        jt808Packet.header.terminalId,
        counter + 100
      )
    );

    (response.response as Buffer[]).push(
      jt808CreateTerminalAttributesMessage(
        jt808Packet.header.terminalId,
        counter + 101
      )
    );

    // TODO: Enviar configuración inicial al dispositivo

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
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
    jt808Packet.header.msgType === 0x0704 ||
    jt808Packet.header.msgType === 0x0201
  ) {
    const locations = jt808DecodeLocations(
      jt808Packet.body,
      jt808Packet.header.msgType === 0x0704
    );

    // TODO: Tratar las locations
    if (locations.count > 0) {
      for (const location of locations.locations) {
        if (location.lat !== 0 && location.lon !== 0) {
        } 


        //const positionPacket: PositionPacket | undefined = createPositionPacket(
        //  response.imei,
        //  remoteAddress,
        //  location.values,
        //  GpsAccuracy.unknown,
        //  "{}"
        //);
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
      }
    }

    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    updateLastActivity = true;
    if (jt808Packet.header.msgType === 0x0704) {
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ✅ Positioning data batch upload successful`
      );
    }
    if (jt808Packet.header.msgType === 0x0201) {
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ✅ Location information query response successful`
      );
    }
  }

  // ---------------------------------------
  // Location report（0x0200）
  //     response 0x8001
  // ---------------------------------------
  else if (jt808Packet.header.msgType === 0x0200) {
    const location = jt808DecodeLocationReport(jt808Packet.body);

    // TODO: Tratar las location

    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
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
  else if (jt808Packet.header.msgType === 0x0109) {
    (response.response as Buffer[]).push(
      jt808CreateFrameData({
        msgType: 0x8109,
        terminalId: Buffer.from(jt808Packet.header.terminalId, "hex"),
        msgSerialNumber: counter,
        body: Buffer.from(
          byteArrayToHexString(
            numberToHexByteArray(jt808Packet.header.msgSerialNumber)
          ) +
            toHexWith(jt808Packet.header.msgType, 4) +
            jt808TimeSyncBody().toString("hex"),
          "hex"
        ),
      })
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
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
  else if (jt808Packet.header.msgType === 0x0210) {
    const batteryPercent: number = jt808Packet.body.readUInt8(0);
    const date: string =
      "20" +
      jt808Packet.body.readUInt8(1) +
      "-" +
      jt808Packet.body.readUInt8(2) +
      "-" +
      jt808Packet.body.readUInt8(3);
    const time: string =
      jt808Packet.body.readUInt8(4) +
      ":" +
      jt808Packet.body.readUInt8(5) +
      ":" +
      jt808Packet.body.readUInt8(6);

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Battery level: ${batteryPercent}% at ${date} ${time}`
    );

    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    await positionUpdateBatteryAndLastActivity(
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
  // Terminal Logout（0x0003）
  // Sleep notification（0x0105）
  // Sleep wake up notification（0x0108）
  // Unknown command 10 07（0x1007）
  //     response 0x8001
  // ---------------------------------------
  else if (
    [0x0002, 0x0003, 0x0105, 0x0108, 0x1007].includes(jt808Packet.header.msgType)
  ) {
    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    const bodyString = jt808Packet.body.toString("hex");

    updateLastActivity = true;
    let messageText = "";

    if (jt808Packet.header.msgType === 0x0002) {
      (response.response as Buffer[]).push(
        jt808CreateQueryLocationMessage(
          jt808Packet.header.terminalId,
          counter + 100
        )
      );
      messageText = "Terminal heartbeat";
    } else if (jt808Packet.header.msgType === 0x0003) {
      // TODO: Desconectar el dispositivo (conn.close)
      messageText = "Terminal Logout";
    } else if (jt808Packet.header.msgType === 0x0105) {
      messageText = "Sleep notification";
    } else if (jt808Packet.header.msgType === 0x0108) {
      messageText = "Sleep wake up notification";
    } else if (jt808Packet.header.msgType === 0x1007) {
      messageText = "Unknown command 10 07";
    }

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ ${messageText} -> body ${bodyString}`
    );
  }

  // ---------------------------------------
  // Check terminal attribute response（0x0107）
  //     response 0x8001
  // ---------------------------------------
  else if (jt808Packet.header.msgType === 0x0107) {
    const terminalAttributes = jt808ParseTerminalAttributes(jt808Packet.body);

    // TODO: Tratar las terminalAttributes
    console.log(`Record: ${JSON.stringify(terminalAttributes, null, 2)}`);

    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);

    const bodyString = jt808Packet.body.toString("hex");

    updateLastActivity = true;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Check terminal attribute response successful`
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

  //
  //  /** Add position and update device */
 
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
