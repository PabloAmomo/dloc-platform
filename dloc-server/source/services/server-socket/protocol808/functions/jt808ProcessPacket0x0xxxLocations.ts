import { getNormalizedIMEI } from '../../../../functions/getNormalizedIMEI';
import padNumberLeft from '../../../../functions/padNumberLeft';
import { Jt808ProcessPacket } from '../models/Jt808ProcessPacket';
import jt808CreateGeneralResponse from './jt808CreateGeneralResponse';
import jt808DecodeLocationReport from './jt808DecodeLocationReport';
import jt808DecodeLocations from './jt808DecodeLocations';
import jt808PersistLocation from './jt808PersistLocation';
import jt808PrintMessage from './jt808PrintMessage';

const jt808ProcessPacket0x0xxxLocations: Jt808ProcessPacket = async ({
  remoteAddress,
  response,
  jt808Packet,
  counter,
  persistence,
}) => {
   let locations;
    if (jt808Packet.header.msgType === 0x0200)
      locations = {
        count: 1,
        locations: [jt808DecodeLocationReport(jt808Packet.body)],
      };
    else
      locations = jt808DecodeLocations(
        jt808Packet.body,
        jt808Packet.header.msgType === 0x0704
      );

    (response.response as Buffer[]).push(
      jt808CreateGeneralResponse(
        jt808Packet.header.terminalId,
        counter,
        jt808Packet.header.msgSerialNumber,
        jt808Packet.header.msgType,
        "00"
      )
    );

    response.imei = padNumberLeft(jt808Packet.header.terminalId, 15, "0");
    const imei = getNormalizedIMEI(response.imei);
    const updateLastActivity = false;

    let lastLatLng = "";
    if (locations.count > 0) {
      for (const location of locations.locations) {
        if (location.lat !== 0 && location.lng !== 0)
          lastLatLng = `[(${location.dateTimeUTC}) ${location.lat}, ${location.lng}]`;

        await jt808PersistLocation(
          imei,
          remoteAddress,
          location,
          persistence,
          jt808Packet.body,
          response
        );
      }
    }

    jt808PrintMessage(
      imei,
      remoteAddress,
      jt808Packet.header.msgType,
      lastLatLng
    );

  return {
    updateLastActivity,
    imei,
    mustDisconnect: false,
  };
};

export default jt808ProcessPacket0x0xxxLocations;
