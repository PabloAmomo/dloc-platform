import { createLocationPacket } from "../../../functions/createLocationPacket";
import { getUtcDateTime } from "../../../functions/getUtcDateTime";
import { HandlePacket } from "../../../models/HandlePacket";
import { HandlePacketProps } from "../../../models/HandlePacketProps";
import { HandlePacketResult } from "../../../models/HandlePacketResult";
import { PositionPacket } from "../../../models/PositionPacket";
import { printMessage } from "../../../functions/printMessage";
import { REGEX_PACKETS } from "../../../functions/packetParseREGEX";
import { GpsAccuracy } from "../../../models/GpsAccuracy";
import getValuesFromStringByRegexs from "../../../functions/getValuesFromStringByRegex";
import discardData from "../../../functions/discardData";
import updateDeviceAndAddPosition from "../../../functions/updateDeviceAndAddPosition";
import getLbsLocation from "../../../functions/getLbsLocation";
import updateBattery from "../../../functions/updateBattery";
import locationUpdateLastActivityAndAddHistory from "../../../functions/locationUpdateLastActivityAndAddHistory";
import { handlePacketOnError } from "../../../functions/handlePacketOnError";

const noImei: string = "no imei received";

const handlePacket: HandlePacket = async (
  props: HandlePacketProps
): Promise<HandlePacketResult> => {
  const { imei, remoteAdd, data, persistence } = props;

  let updateLastActivity: boolean = false;
  let response: HandlePacketResult = { imei, error: "", response: "" };

  /** Temporal imei (Used only for print messages for user) */
  var imeiTemp: string = imei == "" ? "---------------" : imei;

  // ---------------------------------------
  // Login Package TRVAP00xxxxIMEIxxxxxxx#
  // ---------------------------------------
  if (data.startsWith("TRVAP00")) {
    response.imei = data.replace("TRVAP00", "").replace("#", "");
    imeiTemp = response.imei == "" ? "---------------" : response.imei;

    /** Update last activity */
    if (response.imei !== "") updateLastActivity = true;
    printMessage(`[${imeiTemp}] (${remoteAdd}) imei [${response.imei}]`);

    response.response = "TRVBP00" + getUtcDateTime(false) + "#";
  }

  // ---------------------------------------
  // GPS DATA (14 or REPLY 15)
  // ---------------------------------------
  else if (data.startsWith("TRVYP14") || data.startsWith("TRVYP15")) {
    const packetType = data.startsWith("TRVYP14") ? "TRVYP14" : "TRVYP15";

    /** Process GPS data */
    let { values, regexIndex } = getValuesFromStringByRegexs(
      data,
      REGEX_PACKETS
    );
    if (regexIndex != -1)
      printMessage(
        `[${imeiTemp}] (${remoteAdd}) process data (REGEX ${regexIndex}) [${
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
        remoteAdd,
        data,
        response
      );

    /** Create location packet and persist */
    const locationPacket: PositionPacket | undefined = createLocationPacket(
      response.imei,
      remoteAdd,
      values,
      GpsAccuracy.unknown,
      "{}"
    );

    /** Check if location packet was created */
    if (!locationPacket)
      return await discardData(
        "error creating location packet",
        false,
        persistence,
        imeiTemp,
        remoteAdd,
        data,
        response
      );

    /** Update last activity */
    updateLastActivity = true;

    if (!locationPacket.valid) {
      /** Invalid position, try to get location from LBS */
      printMessage(
        `[${imeiTemp}] (${remoteAdd}) invalid position (NOT 'A') [${
          data.split(",")[0]
        }]`
      );

      /** LBS query */
      const lbsGetResponse = await getLbsLocation(
        data,
        packetType,
        persistence,
        imeiTemp,
        remoteAdd,
        response
      );
      if ("error" in lbsGetResponse && lbsGetResponse.error)
        return lbsGetResponse;

      /** Process LBS data */
      if ("location" in lbsGetResponse) {
        locationPacket.lat = lbsGetResponse.location.lat;
        locationPacket.lng = lbsGetResponse.location.lng;
        locationPacket.valid = true;
        locationPacket.accuracy = GpsAccuracy.lbs;
      }
    }

    /** Add position and update device */
    if (locationPacket.valid)
      await updateDeviceAndAddPosition(
        locationPacket,
        persistence,
        imeiTemp,
        remoteAdd,
        data,
        response
      );

    response.response = `TRVZP${data.substring(5, 7)}#`;
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
        remoteAdd,
        data,
        response
      );

    /** LBS query */
    const lbsGetResponse = await getLbsLocation(
      data,
      packetType,
      persistence,
      imeiTemp,
      remoteAdd,
      response
    );
    if ("error" in lbsGetResponse && lbsGetResponse.error)
      return lbsGetResponse;

    /** Process LBS data */
    if ("location" in lbsGetResponse) {
      const { lat, lng } = lbsGetResponse.location;
      response.response = `TRVBP14,${lat.toFixed(5)},${lng.toFixed(5)}#`;
    } else {
      response.response = `TRVBP${data.substring(5, 7)}#`;
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
        remoteAdd,
        data,
        response
      );

    /** Process Battery level on packet heartbeat */
    if (data.startsWith("TRVYP16")) {
      if (data.length < 18) updateLastActivity = true;
      else
        await updateBattery(data, persistence, response, imeiTemp, remoteAdd);
    }

    response.response = `TRVZP${data.substring(5, 7)}#`;
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
        remoteAdd,
        data,
        response
      );

    response.response = `TRVBP${data.substring(5, 7)}#`;
  }

  // ------------------------------------------------
  // Packets with not response needed
  // ------------------------------------------------
  else if (data.startsWith("TRVAP20") || data.startsWith("TRVAP61")) {
    printMessage(
      `[${imeiTemp}] (${remoteAdd}) received no response needed [${data}]`
    );
  }

  // ------------------------------------------------
  // Response to TRVWP02 config packet (Only Info)
  // ------------------------------------------------
  else if (data.startsWith("TRVXP020000010")) {
    updateLastActivity = true;
    printMessage(
      `[${
        imeiTemp == "" ? "---------------" : response.imei
      }] (${remoteAdd}) confirmed TRVWP02 packet received`
    );
  }

  // ---------------------------------------------
  // Unknow command - Discart packet
  // ---------------------------------------------
  else {
    printMessage(
      `[${imeiTemp}] (${remoteAdd}) command unknown in data [${
        data.length > 20 ? data.substring(0, 20) + "..." : data
      }...]`
    );
    return await discardData(
      "commad unknown",
      false,
      persistence,
      imeiTemp,
      remoteAdd,
      data,
      response
    );
  }

  /** Update last activity and add history */
  locationUpdateLastActivityAndAddHistory(
    imeiTemp,
    remoteAdd,
    data,
    persistence,
    updateLastActivity,
    (error) => {
      handlePacketOnError({
        imei: imeiTemp,
        remoteAdd,
        data,
        persistence,
        name: "lastActivity",
        error,
      });
    },
    (error) => {
      handlePacketOnError({
        imei: imeiTemp,
        remoteAdd,
        data,
        persistence,
        name: "history",
        error,
      });
    }
  );

  /** */
  const message =
    response.response !== ""
      ? `response [${response.response}]`
      : `no response to send for packet [${data}]`;
  printMessage(`[${imeiTemp}] (${remoteAdd}) ${message}`);

  /** Return imei */
  return response;
};

export { handlePacket };
