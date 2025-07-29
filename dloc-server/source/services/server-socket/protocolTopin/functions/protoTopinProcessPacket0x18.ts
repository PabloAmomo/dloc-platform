import getDateTimeValues from "../../../../functions/getDateTimeValues";
import { printMessage } from "../../../../functions/printMessage";
import { GoogleGeoPositionRequest } from "../../../../models/GoogleGeoPositionRequest";
import { GpsAccuracy } from "../../../../models/GpsAccuracy";
import { PositionPacket } from "../../../../models/PositionPacket";
import getLbsPosition from "../../functions/getLbsPosition";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreateGoogleGeoPositionRequest from "./protoTopinCreateGoogleGeoPositionRequest";
import protoTopinCreateResponse0x18 from "./protoTopinCreateResponse0x18";
import protoTopinPersistPosition from "./protoTopinPersistPosition";
import convertRSSIToPercent from "../../../../functions/convertRSSIToPercent";
import protoTopinGetBCDDateTimeUTC from "./protoTopinGetBCDDateTimeUTC";

const protoTopinProcessPacket0x18: ProtoTopinProcessPacket = async ({
  imei,
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  printMessage(`${prefix} 📡 wifi data packet received (0x18) (Process and Get LBS Location)`);

  const { year, month, day, hours, minutes, seconds } = getDateTimeValues(new Date(), true);
  (response.response as Buffer[]).push(
    protoTopinCreateResponse0x18(Buffer.from([year, month, day, hours, minutes, seconds]))
  );

  if (topinPacket.informationContent.length < 6)
    throw new Error(`data length to short (${topinPacket.informationContent.length}), cannot extract date.`);

  const bufferDate = topinPacket.informationContent.slice(0, 6);
  const dateTimeUtc = protoTopinGetBCDDateTimeUTC(bufferDate);

  const googleGeoPositionRequest: GoogleGeoPositionRequest | null = protoTopinCreateGoogleGeoPositionRequest(
    prefix,
    topinPacket.informationContent,
    topinPacket.packetLength
  );
  if (googleGeoPositionRequest) {
    try {
      let gsmSignal = -1;
      if ("cellTowers" in googleGeoPositionRequest) {
        for (const cellTower of googleGeoPositionRequest.cellTowers) {
          if (cellTower.signalStrength && convertRSSIToPercent(cellTower.signalStrength) > gsmSignal)
            gsmSignal = convertRSSIToPercent(cellTower.signalStrength);
        }
      }

      const lbsGetResponse = await getLbsPosition(googleGeoPositionRequest, persistence, imei, remoteAddress, response);

      if ("error" in lbsGetResponse && lbsGetResponse.error) throw new Error(lbsGetResponse.error);

      /** Process LBS data */
      if ("location" in lbsGetResponse) {
        const location: PositionPacket = {
          imei,
          remoteAddress,
          dateTimeUtc,
          valid: true,
          lat: lbsGetResponse.location.lat,
          lng: lbsGetResponse.location.lng,
          speed: 0,
          directionAngle: 0,
          gsmSignal,
          batteryLevel: -1,
          accuracy: GpsAccuracy.lbs,
          activity: "{}",
        };
        protoTopinPersistPosition(response.imei, remoteAddress, location, persistence, topinPacket, response, prefix);
      }
    } catch (error) {
      printMessage(
        `${prefix} ❌ Error processing LBS position: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  return {
    updateLastActivity: true,
    imei: response.imei,
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x18;
