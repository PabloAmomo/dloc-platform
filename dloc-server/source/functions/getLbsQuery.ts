function getLbsQuery(packetTRVAP14: string): GoogleGeolocationLBS {
  if (!packetTRVAP14.startsWith("TRVAP14")) {
    return {
      error: "Invalid packet format",
    };
  }
  
  const lbsData = packetTRVAP14
    .replace("TRVAP14", "")
    .replace("#", "")
    .split(",");
  if (lbsData.length < 4) {
    return {
      error: "LBS data not found",
    };
  }
  const mcc: string = lbsData[0];
  const mnc: string = lbsData[1];
  const lac: string = lbsData[2];
  const cid: string = lbsData[3];

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

export default getLbsQuery;
