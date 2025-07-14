import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { printMessage } from "../../../../functions/printMessage";
import discardData from "../../../../functions/discardData";
import positionUpdateLastActivityAndAddHistory from "../../../../functions/positionUpdateLastActivityAndAddHistory";
import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import convertStringToHexString from "../../../../functions/convertStringToHexString";
import padNumberLeft from "../../../../functions/padNumberLeft";
import toHexWith from "../../../../functions/toHexWith";
import jt808GetFrameData from "../functions/jt808GetFrameData";
import jt808CreateGeneralResponse from "../functions/jt808CreateGeneralResponse";
import jt808CreateQueryLocationMessage from "../functions/jt808CreateQueryLocationMessage";
import jt808DecodeLocations from "../functions/jt808DecodeLocations";
import jt808DecodeLocationReport from "../functions/jt808DecodeLocationReport";
import jt808ParseTerminalAttributes from "../functions/jt808ParseTerminalAttributesBits";
import jt808PersistLocation from "../functions/jt808PersistLocation";
import jt808ParseCommonResultFromTerminal from "../functions/jt808ParseCommonResultFromTerminal";
import jt808CreateCheckParameterSettingPacket from "../functions/jt808CreateCheckParameterSettingPacket";
import jt808ParseParamentersSettings from "../functions/jt808ParseParamentersSettings";
import { Jt808HandlePacket } from "../models/Jt808HandlePacket";
import { Jt808HandlePacketProps } from "../models/Jt808HandlePacketProps";
import jt808CreateMessage from "../functions/jt808CreateMessage";
import jt808CreateRequestSyncTimePacket from "../functions/jt808CreateRequestSyncTimePacket";
import j808GetBatteryLevelPacketDateTime from "../functions/j808GetBatteryLevelPacketDateTime";
import jt808CreateParameterSettingPacket from "../functions/jt808CreateParameterSettingPacket";

// TODO: [REFACTOR] Mover parte del codigo a otro lado, o fragmentar su responsabilidad

const handlePacket: Jt808HandlePacket = async (
  props: Jt808HandlePacketProps
): Promise<HandlePacketResult> => {
  const {
    imei,
    remoteAddress: remoteAddress,
    data,
    persistence,
    counter,
  } = props;

  let updateLastActivity: boolean = false;
  let response: HandlePacketResult = {
    imei,
    error: "",
    response: [],
    mustDisconnect: false,
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
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00" + jt808Packet.header.terminalId
      )
    );

    // TODO: [VERIFICATION ]Verificar que funciona bien el cambio de time zone cuando se registra el dispositivo
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

    // TODO: [BUG] No funciona y no se porque, revisar (Luego usar jt808CreateCheckParameterSettingPacket)
    (response.response as Buffer[]).push(
      jt808CreateMessage(
        jt808Packet.header.terminalId,
        counter + 101,
        0x8106,
        Buffer.from("0100000001", "hex")
      )
    );

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

    if (locations.count > 0) {
      for (const location of locations.locations) {
        if (location.lat !== 0 && location.lng !== 0)
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

    let message = "";
    if (jt808Packet.header.msgType === 0x0200) message = "report";
    else if (jt808Packet.header.msgType === 0x0201)
      message = "information query response";
    else if (jt808Packet.header.msgType === 0x0704)
      message = "positioning data batch upload";

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ 🧭 Location ${message} successful`
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
    const dateTime = j808GetBatteryLevelPacketDateTime(jt808Packet.body);

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ Battery level: ${batteryLevel}% at ${dateTime}`
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

    const bodyString = jt808Packet.body.toString("hex");

    updateLastActivity = true;
    let messageText = "";

    if (jt808Packet.header.msgType === 0x0002) {
      messageText = "❤️  Terminal heartbeat";
    } else if (jt808Packet.header.msgType === 0x0003) {
      response.mustDisconnect = true; 
      messageText = "🔚 Terminal Logout";
    } else if (jt808Packet.header.msgType === 0x0104) {
      messageText = "⚙️  Check terminal parameter response";
      const parametersSettings = jt808ParseParamentersSettings(
        imeiTemp,
        remoteAddress,
        jt808Packet.body
      );
      if (parametersSettings.paramatersSettings.batteryLevel) {
        await positionUpdateBatteryAndLastActivity(
          imeiTemp,
          remoteAddress,
          persistence,
          parametersSettings.paramatersSettings.batteryLevel.value as number
        );
        printMessage(
          `[${imeiTemp}] (${remoteAddress}) 🔋 Battery level ✅ ${parametersSettings.paramatersSettings.batteryLevel.value}% (Updated on device)`
        );
      }
      // TODO: [FEATURE] Procesar los parametros (timezona)
      // TODO: [FEATURE] Si la timeZone no es 0, enviar un actualización para que se ponga a UTC (OJO QUE RESETEA EL DISPOSITIVO) - Ver registro de device
      //      for (const param of parametersSettings.parameters) {
    } else if (jt808Packet.header.msgType === 0x0105) {
      messageText = "💤 Sleep notification";
    } else if (jt808Packet.header.msgType === 0x0107) {
      messageText = "✅ Check terminal attribute response";
      const terminalAttributes = jt808ParseTerminalAttributes(jt808Packet.body);
      const terminalData = `${terminalAttributes.manufacturerId} Model ${terminalAttributes.terminalModel} - SimIccid ${terminalAttributes.simIccid}`;
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) 👉 Terminal attributtes: ${terminalData}`
      );
    } else if (jt808Packet.header.msgType === 0x0108) {
      messageText = "🌟 Sleep wake up notification";
    } else if (jt808Packet.header.msgType === 0x0112) {
      // TODO: [FEATURE]  Crear un parser para los mensajes 0x0112 (Upload the power saving mode modified by SMS to the serve)
      // 7E 01 12 00 06 05 62 13 41 76 54 00 09 08 00 00 00 00 00 03 7E
      messageText =
        "⚡️ Upload the power saving mode modified by SMS to the serve";
    } else if (jt808Packet.header.msgType === 0x1007) {
      messageText = "🔥 Unknown command 10 07";
    }

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ✅ ${messageText} -> body ${
        bodyString !== "" ? bodyString : "(empty)"
      }`
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

    // TODO: [REMOVE DEBUG] Eliminar en un futuro. Solo para debug
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
  if (response.response.length === 0) {
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ⚠️  no response to send for packet [${dataString}]`
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
