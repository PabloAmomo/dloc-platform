import { Protocols } from "../../../enums/Protocols";
import getGoogleGeoPosition from "../../../functions/getGoogleGeoPosition";
import { printMessage } from "../../../functions/printMessage";
import { GoogleGeoPositionRequest } from "../../../models/GoogleGeoPositionRequest";
import { GoogleGeoPositionResponse as GoogleGeoPositionResponse } from "../../../models/GoogleGeoPositionResponse";
import { Persistence } from "../../../models/Persistence";
import { ENABLE_LBS } from "../../../server";
import HandlePacketResult from "../models/HandlePacketResult";
import discardData from "./discardData";

async function getLbsPosition(
  googleGeoPositionRequest: GoogleGeoPositionRequest,
  persistence: Persistence,
  imeiTemp: string,
  protocol: Protocols,
  remoteAddress: string,
  response: HandlePacketResult
): Promise<HandlePacketResult | GoogleGeoPositionResponse | {}> {
  if (!ENABLE_LBS) {
    printMessage(`[${imeiTemp}] (${remoteAddress}) 🗼 [LBS] 🚫 Google Geoposition disabled`);
    return {};
  }
  printMessage(
    `[${imeiTemp}] (${remoteAddress}) 🗼 [LBS] 🆗 Google Geoposition enabled (Watch the Google Geoposition API quota)`
  );

  /** LBS query */
  if ("error" in googleGeoPositionRequest && googleGeoPositionRequest.error) {
    return await discardData(
      googleGeoPositionRequest.error,
      true,
      persistence,
      imeiTemp,
      protocol,
      remoteAddress,
      JSON.stringify(googleGeoPositionRequest),
      response
    );
  }

  printMessage(`[${imeiTemp}] (${remoteAddress}) 🗼 [LBS] 📡 request Google Geoposition`);

  /** LBS query Google */
  const lbsResponse = await getGoogleGeoPosition(googleGeoPositionRequest, imeiTemp, remoteAddress);

  printMessage(
    `[${imeiTemp}] (${remoteAddress}) 🗼 [LBS] 🧭 Google Geoposition response [${JSON.stringify(lbsResponse)}]`
  );

  return lbsResponse;
}

export default getLbsPosition;
