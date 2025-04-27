import { HandlePacketResult } from "../models/HandlePacketResult";
import { Persistence } from "../models/Persistence";
import createGoogleGeolocationRequest, { PacketType } from "./createGoogleGeolocationRequest";
import discardData from "./discardData";
import getGoogleGeolocation from "./getGoogleGeolocation";
import { printMessage } from "./printMessage";

async function getLbsLocation(
  data: string,
  packetType: PacketType,
  persistence: Persistence,
  imeiTemp: string,
  remoteAdd: string,
  response: HandlePacketResult
): Promise<HandlePacketResult | GoogleGeolocationResponse> {

  /** LBS query */
  const lbsQuery = createGoogleGeolocationRequest(data, packetType);
  if ("error" in lbsQuery && lbsQuery.error)
    return await discardData(
      lbsQuery.error,
      true,
      persistence,
      imeiTemp,
      remoteAdd,
      data,
      response
    );

  printMessage(
    `[${imeiTemp}] (${remoteAdd}) LBS (${packetType}) request Google Geolocation`
  );

  /** LBS query Google */
  const lbsResponse = await getGoogleGeolocation(lbsQuery);

  printMessage(
    `[${imeiTemp}] (${remoteAdd}) LBS (${packetType}) Google Geolocation response [${JSON.stringify(
      lbsResponse
    )}]`
  );

  return lbsResponse;
}

export default getLbsLocation;
