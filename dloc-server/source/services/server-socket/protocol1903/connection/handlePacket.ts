import { getUtcDateTime } from "../../../../functions/getUtcDateTime";
import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { PositionPacket } from "../../../../models/PositionPacket";
import { printMessage } from "../../../../functions/printMessage";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import getValuesFromStringByRegexs from "../../../../functions/getValuesFromStringByRegex";
import discardData from "../../../../functions/discardData";
import getLbsPosition from "../../../../functions/getLbsPosition";
import positionUpdateLastActivityAndAddHistory from "../../../../functions/positionUpdateLastActivityAndAddHistory";
import positionAddPositionAndUpdateDevice from "../../../../functions/positionAddPositionAndUpdateDevice";
import positionUpdateBatteryAndLastActivity from "../../../../functions/positionUpdateBatteryAndLastActivity";
import {
  getNormalizedIMEI,
  NO_IMEI_STRING,
} from "../../../../functions/getNormalizedIMEI";
import proto1903CreatePositionPacket from "../functions/proto1903CreatePositionPacket";
import PROTO1903_REGEX_PACKETS from "../functions/proto1903PacketParseREGEX";
import Proto1903HandlePacket from "../models/Proto1903HandlePacket";
import Proto1903HandlePacketProps from "../models/Proto1903HandlePacketProps";

const noImei: string = "no imei received";

const handlePacket: Proto1903HandlePacket = async (
  props: Proto1903HandlePacketProps
): Promise<HandlePacketResult> => {
  const { imei, remoteAddress: remoteAddress, data, persistence } = props;

  let updateLastActivity: boolean = false;
  let response: HandlePacketResult = {
    imei,
    error: "",
    response: [],
    mustDisconnect: false,
  };

  /** Temporal imei (Used only for print messages for user) */
  var imeiTemp: string = getNormalizedIMEI(imei);

  // ---------------------------------------
  // Login Package TRVAP00xxxxIMEIxxxxxxx#
  // ---------------------------------------
  if (data.startsWith("TRVAP00")) {
    response.imei = data.replace("TRVAP00", "").replace("#", "");
    imeiTemp = getNormalizedIMEI(response.imei);

    /** Update last activity */
    if (response.imei !== "") updateLastActivity = true;
    printMessage(`[${imeiTemp}] (${remoteAddress}) ✅ imei [${response.imei}]`);

    (response.response as string[]).push(
      "TRVBP00" + getUtcDateTime(false) + "#"
    );
  }

  // ---------------------------------------
  // GPS DATA (14 or REPLY 15)
  // ---------------------------------------
  else if (data.startsWith("TRVYP14") || data.startsWith("TRVYP15")) {
    const packetType = data.startsWith("TRVYP14") ? "TRVYP14" : "TRVYP15";

    /** Process GPS data */
    let { values, regexIndex } = getValuesFromStringByRegexs(
      data,
      PROTO1903_REGEX_PACKETS
    );
    if (regexIndex != -1)
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ℹ️  process data (REGEX ${regexIndex}) [${
          data.split(",")[0]
        }]`
      );

    /** imei not received */
    if (response.imei == "")
      return await discardData(
        noImei,
        true,
        persistence,
        imeiTemp,
        remoteAddress,
        data,
        response
      );

    /** Create position packet and persist */
    const positionPacket: PositionPacket | undefined =
      proto1903CreatePositionPacket(
        response.imei,
        remoteAddress,
        values,
        GpsAccuracy.unknown,
        "{}"
      );

    /** Check if position packet was created */
    if (!positionPacket)
      return await discardData(
        "error creating position packet",
        false,
        persistence,
        imeiTemp,
        remoteAddress,
        data,
        response
      );

    /** Update last activity */
    updateLastActivity = true;

    if (!positionPacket.valid) {
      /** Invalid position, try to get position from LBS */
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ⚠️  invalid position (NOT 'A') [${
          data.split(",")[0]
        }]`
      );

      /** LBS query */
      const lbsGetResponse = await getLbsPosition(
        data,
        packetType,
        persistence,
        imeiTemp,
        remoteAddress,
        response
      );
      if ("error" in lbsGetResponse && lbsGetResponse.error)
        return lbsGetResponse;

      /** Process LBS data */
      if ("location" in lbsGetResponse) {
        positionPacket.lat = lbsGetResponse.location.lat;
        positionPacket.lng = lbsGetResponse.location.lng;
        positionPacket.valid = true;
        positionPacket.accuracy = GpsAccuracy.lbs;
      }
    }

    /** Add position and update device */
    if (positionPacket.valid) {
      let oldPacket: boolean = false;
      const oldPacketMessage = "old packet";

      await positionAddPositionAndUpdateDevice(
        imeiTemp,
        remoteAddress,
        positionPacket,
        persistence,
        () => {},
        (error) => {
          oldPacket = error?.message === "old packet";
        }
      );

      if (oldPacket)
        await discardData(
          oldPacketMessage,
          true,
          persistence,
          imeiTemp,
          remoteAddress,
          data,
          response
        );
    }

    (response.response as string[]).push(`TRVZP${data.substring(5, 7)}#`);
  }

  // ---------------------------------------------
  // Response to TRVAP14 packet (LBS)
  // ---------------------------------------------
  else if (data.startsWith("TRVAP14")) {
    const packetType = "TRVAP14";

    if (response.imei == "")
      return await discardData(
        noImei,
        true,
        persistence,
        imeiTemp,
        remoteAddress,
        data,
        response
      );

    /** LBS query */
    const lbsGetResponse = await getLbsPosition(
      data,
      packetType,
      persistence,
      imeiTemp,
      remoteAddress,
      response
    );
    if ("error" in lbsGetResponse && lbsGetResponse.error)
      return lbsGetResponse;

    /** Process LBS data */
    if ("location" in lbsGetResponse) {
      const { lat, lng } = lbsGetResponse.location;
      (response.response as string[]).push(
        `TRVBP14,${lat.toFixed(5)},${lng.toFixed(5)}#`
      );
    } else {
      (response.response as string[]).push(`TRVBP${data.substring(5, 7)}#`);
    }
  }

  // ---------------------------------------------
  // TRVYP1:  UNKNOW but need response
  // TRVYP02: IMSI and ICCID number of the device
  // TRVYP16: Device heartbeat packet
  // ---------------------------------------------
  else if (
    data.startsWith("TRVYP02") ||
    data.startsWith("TRVYP1") ||
    data.startsWith("TRVYP16")
  ) {
    if (response.imei == "")
      return await discardData(
        noImei,
        true,
        persistence,
        imeiTemp,
        remoteAddress,
        data,
        response
      );

    /** Process Battery level on packet heartbeat */
    if (data.startsWith("TRVYP16")) {
      if (data.length < 18) updateLastActivity = true;
      else {
        const batteryLevel: number = parseInt(data.substring(14, 17) ?? "-1");
        await positionUpdateBatteryAndLastActivity(
          imeiTemp,
          remoteAddress,
          persistence,
          batteryLevel
        );
      }
    }

    (response.response as string[]).push(`TRVZP${data.substring(5, 7)}#`);
  }

  // ---------------------------------------------
  // UNKNOW but need response (TRVAP Packets)
  // ---------------------------------------------
  else if (data.startsWith("TRVAP89")) {
    if (response.imei == "")
      return await discardData(
        noImei,
        true,
        persistence,
        imeiTemp,
        remoteAddress,
        data,
        response
      );

    (response.response as string[]).push(`TRVBP${data.substring(5, 7)}#`);
  }

  // ------------------------------------------------
  // Packets with not response needed
  // ------------------------------------------------
  else if (data.startsWith("TRVAP20") || data.startsWith("TRVAP61")) {
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 🥷 received no response needed [${data}]`
    );
  }

  // ------------------------------------------------
  // Packets with not response needed
  // TRVCP03: Set heartbeat packet interval
  // TRVXP02: Set upload interval
  // TRVAP92: Set LED display switch
  // ------------------------------------------------
  else if (
    data.startsWith("TRVCP03") ||
    data.startsWith("TRVXP02") ||
    data.startsWith("TRVAP92")
  ) {
    let message: string = "";
    const resultVal: string = data.endsWith("0#") ? "✅ OK" : "❌ ERROR";

    if (data.startsWith("TRVCP03")) message = "Set heartbeat packet interval";
    if (data.startsWith("TRVXP02")) message = "Set Upload interval";
    if (data.startsWith("TRVAP92")) message = "Set Led display switch";

    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 👍 confirmation from device [${data}] (${message} ${resultVal})`
    );
  }

  // ------------------------------------------------
  // Response to TRVWP02 config packet (Only Info)
  // ------------------------------------------------
  else if (data.startsWith("TRVXP020000010")) {
    updateLastActivity = true;
    printMessage(
      `[${
        imeiTemp == "" ? NO_IMEI_STRING : response.imei
      }] (${remoteAddress}) 👌 confirmed TRVWP02 packet received`
    );
  }

  // ---------------------------------------------
  // Unknow command - Discart packet
  // ---------------------------------------------
  else {
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 🤷‍♂️ command unknown in data [${
        data.length > 20 ? data.substring(0, 20) + "..." : data
      }]`
    );
    return await discardData(
      "commad unknown",
      false,
      persistence,
      imeiTemp,
      remoteAddress,
      data,
      response
    );
  }

  /** Update last activity and add history */
  await positionUpdateLastActivityAndAddHistory(
    imeiTemp,
    remoteAddress,
    data,
    persistence,
    updateLastActivity
  );

  /** */
  if (response.response.length === 0) {
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) ⚠️  no response to send for packet [${data}]`
    );
  } else {
    for (let i = 0; i < response.response.length; i++) {
      printMessage(
        `[${imeiTemp}] (${remoteAddress}) ✅ response [${response.response[i]}].`
      );
    }
  }

  /** Return responses */
  return response;
};

export { handlePacket };
