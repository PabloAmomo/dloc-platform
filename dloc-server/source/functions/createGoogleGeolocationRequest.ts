
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
