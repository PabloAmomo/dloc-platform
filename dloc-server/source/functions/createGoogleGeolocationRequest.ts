
function createGoogleGeolocationRequest(packet: string, packetType: "TRVYP14" | "TRVYP15" | "TRVAP14"): GoogleGeolocationRequest {
  if (!packet.startsWith(packetType)) {
    return {
      error: `Invalid ${packetType} packet format`,
    };
  }

  const lbsData = packet
    .replace(packetType, "")
    .replace("#", "")
    .split(",");
  if (lbsData.length < 4) {
    return {
      error: "LBS data not found",
    };
  }

  const startIndex = packetType === "TRVAP14" ? 0 : 1;
  const mcc: string = lbsData[startIndex];
  const mnc: string = lbsData[startIndex + 1];
  const lac: string = lbsData[startIndex + 2];
  const cid: string = lbsData[startIndex + 3];

  if (!mcc || !mnc || !lac || !cid) {
    return {
      error: "LBS data not found",
    };
  }

  const lbsQuery = {
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
  };

  return lbsQuery;
}


export default createGoogleGeolocationRequest;
