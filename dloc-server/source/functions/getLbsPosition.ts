import { GoogleGeoPositionResponse as GoogleGeoPositionResponse } from "../models/GoogleGeoPositionResponse";
import { HandlePacketResult } from "../models/HandlePacketResult";
import { Persistence } from "../models/Persistence";
import { ENABLE_LBS } from "../server";
import createGoogleGeoPositionRequest, {
  PacketType,
} from "./createGoogleGeoPositionRequest";
import discardData from "./discardData";
import getGoogleGeoPosition from "./getGoogleGeoPosition";
import { printMessage } from "./printMessage";

async function getLbsPosition(
  data: string,
  packetType: PacketType,
  persistence: Persistence,
  imeiTemp: string,
  remoteAddress: string,
  response: HandlePacketResult
): Promise<HandlePacketResult | GoogleGeoPositionResponse | {}> {
  if (!ENABLE_LBS) {
    printMessage(
      `[${imeiTemp}] (${remoteAddress}) 🚫 LBS (${packetType}) Google Geoposition disabled`
    );
    return {};
  }
  printMessage(
    `[${imeiTemp}] (${remoteAddress}) ✅ LBS (${packetType}) Google Geoposition enabled (Watch the Google Geoposition API quota)`
  );

  /** LBS query */
  const lbsQuery = createGoogleGeoPositionRequest(data, packetType);
  if ("error" in lbsQuery && lbsQuery.error)
    return await discardData(
      lbsQuery.error,
      true,
      persistence,
      imeiTemp,
      remoteAddress,
      data,
      response
    );

  printMessage(
    `[${imeiTemp}] (${remoteAddress}) 📡 LBS (${packetType}) request Google Geoposition`
  );

  /** LBS query Google */
  const lbsResponse = await getGoogleGeoPosition(lbsQuery, imeiTemp, remoteAddress);

  printMessage(
    `[${imeiTemp}] (${remoteAddress}) 🧭 LBS (${packetType}) Google Geoposition response [${JSON.stringify(
      lbsResponse
    )}]`
  );

  return lbsResponse;
}

export default getLbsPosition;
