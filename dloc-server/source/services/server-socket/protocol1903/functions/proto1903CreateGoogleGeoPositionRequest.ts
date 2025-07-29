import { GoogleGeoPositionRequest } from "../../../../models/GoogleGeoPositionRequest";

export type PacketType = "TRVYP14" | "TRVYP15" | "TRVAP14";

function proto1903CreateGoogleGeoPositionRequest(packet: string, packetType: PacketType): GoogleGeoPositionRequest {
  if (!packet.startsWith(packetType)) {
    return {
      error: `Invalid ${packetType} packet format`,
    };
  }

  const lbsData = packet.replace(packetType, "").replace("#", "").split(",");
  if (lbsData.length < 4) {
    return {
      error: `LBS data not found on ${lbsData}`,
    };
  }

  const mcc: string = lbsData[1];
  const mnc: string = lbsData[2];
  const lac: string = lbsData[3];
  const cid: string = lbsData[4];

  if (!mcc || !mnc || !lac || !cid) {
    return {
      error: `LBS data not found -> mcc: ${mcc}, mnc: ${mnc}, lac: ${lac}, cid: ${cid}`,
    };
  }

  const wifi: string = lbsData.length > 4 ? lbsData?.[5] ?? "" : "";
  const wifiAccessPoints =
    wifi
      ?.split("&")
      ?.map((wifi) => {
        const [ssid, macAddress, signalStrength] = wifi.split("|");
        return { macAddress, signalStrength: parseInt(signalStrength) };
      })
      ?.filter((wifi) => wifi.macAddress) ?? [];

  const lbsQuery: GoogleGeoPositionRequest = {
    homeMobileCountryCode: mcc,
    homeMobileNetworkCode: mnc,
    cellTowers: [
      {
        cellId: cid,
        locationAreaCode: lac,
        mobileCountryCode: mcc,
        mobileNetworkCode: mnc,
      },
    ],
    wifiAccessPoints,
  };

  return lbsQuery;
}

export default proto1903CreateGoogleGeoPositionRequest;
