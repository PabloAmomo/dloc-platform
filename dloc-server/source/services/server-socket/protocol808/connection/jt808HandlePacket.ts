import convertStringToHexString from '../../../../functions/convertStringToHexString';
import { getNormalizedIMEI } from '../../../../functions/getNormalizedIMEI';
import padNumberLeft from '../../../../functions/padNumberLeft';
import positionUpdateBatteryAndLastActivity from '../../../../functions/positionUpdateBatteryAndLastActivity';
import positionUpdateLastActivityAndAddHistory from '../../../../functions/positionUpdateLastActivityAndAddHistory';
import { printMessage } from '../../../../functions/printMessage';
import toHexWith from '../../../../functions/toHexWith';
import discardData from '../../functions/discardData';
import HandlePacketResult from '../../models/HandlePacketResult';
import jt808CehckUploadPowerSaving from '../functions/jt808CehckUploadPowerSaving';
import jt808CheckTerminalParametersResponse from '../functions/jt808CheckTerminalParametersResponse';
import jt808CreateCheckParameterSettingPacket from '../functions/jt808CreateCheckParameterSettingPacket';
import jt808CreateGeneralResponse from '../functions/jt808CreateGeneralResponse';
import jt808CreateMessage from '../functions/jt808CreateMessage';
import jt808CreateParameterSettingPacket from '../functions/jt808CreateParameterSettingPacket';
import jt808CreateQueryLocationMessage from '../functions/jt808CreateQueryLocationMessage';
import jt808CreateRequestSyncTimePacket from '../functions/jt808CreateRequestSyncTimePacket';
import jt808CreateTerminalRegistrationResponsePacket from '../functions/jt808CreateTerminalRegistrationResponsePacket';
import jt808DecodeLocationReport from '../functions/jt808DecodeLocationReport';
import jt808DecodeLocations from '../functions/jt808DecodeLocations';
import jt808GetBatteryLevelPacketDateTime from '../functions/jt808GetBatteryLevelPacketDateTime';
import jt808GetFrameData from '../functions/jt808GetFrameData';
import jt808ParseCommonResultFromTerminal from '../functions/jt808ParseCommonResultFromTerminal';
import jt808ParseTerminalAttributes from '../functions/jt808ParseTerminalAttributesBits';
import jt808PersistLocation from '../functions/jt808PersistLocation';
import Jt808HandlePacket from '../models/Jt808HandlePacket';
import Jt808HandlePacketProps from '../models/Jt808HandlePacketProps';

// TODO: [REFACTOR] Move code and split functionaility to keep this file clean

const messages = {
  0x0002: "❤️  Terminal heartbeat",
  0x0003: "🔚 Terminal Logout",
  0x0104: "⚙️  Check terminal parameter response",
  0x0105: "💤 Sleep notificationSleep notification",
  0x0107: "✅ Check terminal attribute response",
  0x0108: "🌟 Sleep wake up notification",
  0x0112: "⚡️ Upload the power saving mode modified by SMS to the server",
  0x1007: "🔥 Unknown command 10 07",
  0x0100: "📋 Terminal registration",
  0x0102: "🔐 Terminal authentication",
  0x0704: "📦 Positioning data batch upload",
  0x0201: "📍 Location information query response",
  0x0200: "📍 Location report",
  0x0109: "⏰ Request synchronization time",
  0x0210: "🔋 Battery level update when sleep",
};

const jt808HandlePacket: Jt808HandlePacket = async (
  props: Jt808HandlePacketProps
): Promise<HandlePacketResult> => {
  const { imei, remoteAddress, data, persistence, counter, disconnect } = props;

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

  let jt808Packet = jt808GetFrameData(data);

  // ---------------------------------------
  // Terminal registration（0x0100)
  //     response 0x8100
  // ---------------------------------------
  if (jt808Packet.header.msgType === 0x0100) {
    (response.response as Buffer[]).push(
      jt808CreateTerminalRegistrationResponsePacket(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber
      )
    );

    (response.response as Buffer[]).push(
      jt808CreateParameterSettingPacket(
        jt808Packet.header.terminalId,
        counter + 101,
        [
          "0000F142 01 00", // Terminal time zone (0x00 = UTC)
        ]
      )
    );

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 🌎 Time zone to 0 packet sent (Device will restar)`
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

    // TODO: [BUG] Not working and I don't know why. In the future use jt808CreateCheckParameterSettingPacket
    //(response.response as Buffer[]).push(
    //  jt808CreateMessage(
    //    jt808Packet.header.terminalId,
    //    counter + 101,
    //    0x8106,
    //    Buffer.from("0100000001", "hex")
    //  )
    //);

    (response.response as Buffer[]).push(
      jt808CreateCheckParameterSettingPacket(
        jt808Packet.header.terminalId,
        counter + 102,
        []
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
        count: 1,
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

    let lastLatLng = "";
    if (locations.count > 0) {
      for (const location of locations.locations) {
        if (location.lat !== 0 && location.lng !== 0)
          if (location.lat !== 0 && location.lng !== 0)
            lastLatLng = `📍 [(${location.dateTimeUTC}) ${location.lat}, ${location.lng}]`;

        await jt808PersistLocation(
          imeiTemp,
          remoteAddress,
          location,
          persistence,
          data,
          response
        );
      }
    }

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ 🧭 Location ${
        messages[jt808Packet.header.msgType as keyof typeof messages]
      } successful ${lastLatLng}`
    );
  }

  // ---------------------------------------
  // Request synchronization time（0x0109）
  //     response 0x8109 (With time sync body)
  // ---------------------------------------
  else if (jt808Packet.header.msgType === 0x0109) {
    (response.response as Buffer[]).push(
      jt808CreateRequestSyncTimePacket(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber
      )
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);
    updateLastActivity = true;

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ ⏰ Request synchronization time successful`
    );
  }

  // ---------------------------------------
  // Battery level update when sleep（0x0210）
  //     response 0x8001
  // ---------------------------------------
  else if (jt808Packet.header.msgType === 0x0210) {
    const batteryLevel: number = jt808Packet.body.readUInt8(0);
    const dateTime = jt808GetBatteryLevelPacketDateTime(jt808Packet.body);

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 🔋 Battery level: ${batteryLevel}% at ${dateTime}`
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
  // Terminal heartbeat（0x0002）
  // Terminal Logout（0x0003）
  // Check terminal parameter response（0x0104）
  // Sleep notification（0x0105）
  // Check terminal attribute response（0x0107）
  // Sleep wake up notification（0x0108）
  // Unknown command 10 07（0x1007）
  // Upload the power saving mode modified by SMS to the serve (0x0112)
  //     response 0x8001
  // ---------------------------------------
  else if (
    [0x0002, 0x0003, 0x0104, 0x0105, 0x0107, 0x0108, 0x0112, 0x1007].includes(
      jt808Packet.header.msgType
    )
  ) {
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
    imeiTemp = getNormalizedIMEI(response.imei);
    updateLastActivity = true;

    if (jt808Packet.header.msgType === 0x0003) disconnect();
    else if (jt808Packet.header.msgType === 0x0104)
      await jt808CheckTerminalParametersResponse(
        imeiTemp,
        remoteAddress,
        persistence,
        jt808Packet
      );
    else if (jt808Packet.header.msgType === 0x0107) {
      const terminalAttributes = jt808ParseTerminalAttributes(jt808Packet.body);
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) 👉 ⚙️  Terminal attributtes: ${terminalAttributes.manufacturerId} Model ${terminalAttributes.terminalModel} - SimIccid ${terminalAttributes.simIccid}`
      );
    } else if (jt808Packet.header.msgType === 0x0112) {
      const powerSaveModeData = jt808CehckUploadPowerSaving(
        jt808Packet.body,
        imeiTemp,
        remoteAddress
      );
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) 👉 🔋 powerSaveModeData: ${JSON.stringify(
          powerSaveModeData
        )}`
      );
    }

    const bodyString = jt808Packet.body.toString("hex");
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ ${
        messages[jt808Packet.header.msgType as keyof typeof messages]
      } -> body ${bodyString !== "" ? bodyString : "(empty)"}`
    );
  }

  // ---------------------------------------
  // Terminal general response（0x0001）
  // ---------------------------------------
  else if ([0x0001].includes(jt808Packet.header.msgType)) {
    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
    imeiTemp = getNormalizedIMEI(response.imei);
    updateLastActivity = true;

    const reponseCommon = jt808ParseCommonResultFromTerminal(jt808Packet.body);

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 🧑🏽‍💻 Response from terminal to message ${
        reponseCommon.responseToMsgSerialNumber
      } [${toHexWith(reponseCommon.responseToMsgSerialNumber, 4)}] -> result: ${
        reponseCommon.result == "success" ? "✅" : "❌"
      } ${reponseCommon.result} (${reponseCommon.msgSerialNumber})`
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

    // TODO: [REMOVE] Remove this log in production. Only for debug porpose
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 👉👉👉👉👉👉👉👉👉 [${dataString}]`
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
  if (response.response.length === 0)
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ⚠️  no response to send for packet [${dataString}]`
    );
  else {
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

export default jt808HandlePacket;
