import convertRSSIToPercent from "../../../../functions/convertRSSIToPercent";
import getDateTimeValues from "../../../../functions/getDateTimeValues";
import { printMessage } from "../../../../functions/printMessage";
import protoToppisPersistLbsResponse from "../../../../functions/protoToppisPersistLbsResponse";
import { GoogleGeoPositionRequest } from "../../../../models/GoogleGeoPositionRequest";
import getLbsPosition from "../../functions/getLbsPosition";
import { ProtoTopinProcessPacket } from "../models/ProtoTopinProcessPacket";
import protoTopinCreateGoogleGeoPositionRequest from "./protoTopinCreateGoogleGeoPositionRequest";
import protoTopinCreateResponse0x18 from "./protoTopinCreateResponse0x18";
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

    // TODO: [VERIFY] Cehck if the LBS data time is correct and valid to process
  printMessage(`${prefix} 📅 Date and time from device: ${dateTimeUtc.toISOString()}`);

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
      protoToppisPersistLbsResponse({
        imei,
        remoteAddress,
        lbsGetResponse,
        persistence,
        topinPacket,
        dateTimeUtc,
        prefix,
        response,
        gsmSignal: -1,
        batteryLevel: -1,
      });
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
