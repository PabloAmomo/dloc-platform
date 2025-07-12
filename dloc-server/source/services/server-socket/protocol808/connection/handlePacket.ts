import { HandlePacket } from "../../../../models/HandlePacket";
import { HandlePacketProps } from "../../../../models/HandlePacketProps";
import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { printMessage } from "../../../../functions/printMessage";
import discardData from "../../../../functions/discardData";
import positionUpdateLastActivityAndAddHistory from "../../../../functions/positionUpdateLastActivityAndAddHistory";
import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
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
import jt808PersistLocation from "../functions/jt808PersistLocation";
import jt808CreateParameterSettingPacket from "../functions/jt808CreateParameterSettingPacket";
import jt808ParseCommonResultFromTerminal from "../functions/jt808ParseCommonResultFromTerminal";

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
    (response.response as Buffer[]).push(
      jt808CreateParameterSettingPacket(
        jt808Packet.header.terminalId,
        counter + 102
      )
    );

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
  // Location report（0x0200）
  //     response 0x8001
  // ---------------------------------------
  else if ([0x0704, 0x0201, 0x0200].includes(jt808Packet.header.msgType)) {
    let locations;
    if (jt808Packet.header.msgType === 0x0200)
      locations = {
        count: 0,
        locations: [jt808DecodeLocationReport(jt808Packet.body)],
      };
    else
      locations = jt808DecodeLocations(
        jt808Packet.body,
        jt808Packet.header.msgType === 0x0704
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

    if (locations.count > 0) {
      for (const location of locations.locations) {
        if (location.lat !== 0 && location.lng !== 0)
          await jt808PersistLocation(
            imeiTemp,
            remoteAddress,
            location,
            persistence,
            dataBuffer,
            response
          );
      }
    }

    let message = "";
    if (jt808Packet.header.msgType === 0x0200) message = "Location report";
    else if (jt808Packet.header.msgType === 0x0201)
      message = "Location information query response";
    else if (jt808Packet.header.msgType === 0x0704)
      message = "Positioning data batch upload";

    printMessage(`[${imeiTemp}] (${remoteAddress}) ✅ ${message} successful`);
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
    const batteryLevel: number = jt808Packet.body.readUInt8(0);
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
      `[${imeiTemp}] (${remoteAddress}) ✅ Battery level: ${batteryLevel}% at ${date} ${time}`
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
      batteryLevel
    );

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Battery level update when sleep successful`
    );
  }

  // ---------------------------------------
  // Terminal general response（0x0001）-> NO RESPONSE NEEDED
  // Terminal heartbeat（0x0002）
  // Terminal Logout（0x0003）
  // Sleep notification（0x0105）
  // Sleep wake up notification（0x0108）
  // Unknown command 10 07（0x1007）
  //     response 0x8001
  // ---------------------------------------
  else if (
    [0x0001, 0x0002, 0x0003, 0x0105, 0x0108, 0x1007].includes(
      jt808Packet.header.msgType
    )
  ) {
    if (jt808Packet.header.msgType !== 0x0001) {
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
    imeiTemp = getNormalizedIMEI(response.imei);

    const bodyString = jt808Packet.body.toString("hex");

    updateLastActivity = true;
    let messageText = "";

    if (jt808Packet.header.msgType === 0x0001) {
      messageText = "Terminal general response";
      const reponseCommon = jt808ParseCommonResultFromTerminal(
        jt808Packet.body
      );
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) 🌟 Response from terminal to message ${reponseCommon.responseToMsgSerialNumber} -> result: ${reponseCommon.result} (${reponseCommon.msgSerialNumber})`
      );
    } else if (jt808Packet.header.msgType === 0x0002) {
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
      `[${imeiTemp}] (${remoteAddress}) ✅ ${messageText} -> body ${
        bodyString !== "" ? bodyString : "(empty)"
      }`
    );
  }

  // ---------------------------------------
  // Check terminal attribute response（0x0107）
  //     response 0x8001
  // ---------------------------------------
  else if (jt808Packet.header.msgType === 0x0107) {
    const terminalAttributes = jt808ParseTerminalAttributes(jt808Packet.body);

    const terminalData = `${terminalAttributes.manufacturerId} Model ${terminalAttributes.terminalModel} - SimIccid ${terminalAttributes.simIccid}`;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 👉 Terminal attributtes: ${terminalData}`
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

    const bodyString = jt808Packet.body.toString("hex");

    updateLastActivity = true;
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Check terminal attribute response successful`
    );
  }

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
      `[${imeiTemp}] (${remoteAddress}) ⚠️ no response to send for packet [${dataString}]`
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
