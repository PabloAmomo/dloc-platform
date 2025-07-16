import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import padNumberLeft from "../../../../functions/padNumberLeft";
import { Jt808ProcessPacket } from "../models/Jt808ProcessPacket";
import jt808CreateGeneralResponse from "./jt808CreateGeneralResponse";
import jt808DecodeLocationReport from "./jt808DecodeLocationReport";
import jt808DecodeLocations from "./jt808DecodeLocations";
import jt808PersistLocation from "./jt808PersistLocation";
import jt808PrintMessage from "./jt808PrintMessage";

const jt808ProcessPacket0x0xxxLocations: Jt808ProcessPacket = async ({
  remoteAddress,
  response,
  jt808Packet,
  counter,
  persistence,
}) => {
  const {
    body,
    header: { terminalId, msgSerialNumber, msgType },
  } = jt808Packet;

  let locations;
  if (msgType === 0x0200)
    locations = {
      count: 1,
      locations: [jt808DecodeLocationReport(body)],
    };
  else locations = jt808DecodeLocations(body, msgType === 0x0704);

  (response.response as Buffer[]).push(jt808CreateGeneralResponse(terminalId, counter, msgSerialNumber, msgType, "00"));

  response.imei = padNumberLeft(terminalId, 15, "0");
  const imei = getNormalizedIMEI(response.imei);
  const updateLastActivity = false;

  let lastLatLng = "";
  if (locations.count > 0) {
    for (const location of locations.locations) {
      if (location.lat !== 0 && location.lng !== 0)
        lastLatLng = `[(${location.dateTimeUTC}) ${location.lat}, ${location.lng}]`;

      await jt808PersistLocation(imei, remoteAddress, location, persistence, body, response);
    }
  }

  jt808PrintMessage(imei, remoteAddress, msgType, lastLatLng);

  return {
    updateLastActivity,
    imei,
    mustDisconnect: false,
  };
};

export default jt808ProcessPacket0x0xxxLocations;
