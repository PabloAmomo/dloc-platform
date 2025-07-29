import { getNormalizedIMEI } from '../../../../functions/getNormalizedIMEI';
import padNumberLeft from '../../../../functions/padNumberLeft';
import { printMessage } from '../../../../functions/printMessage';
import { ProtoTopinProcessPacket } from '../models/ProtoTopinProcessPacket';
import protoTopinCreateResponse0x01 from './protoTopinCreateResponse0x01';

const protoTopinProcessPacket0x01: ProtoTopinProcessPacket = async ({
  remoteAddress,
  response,
  topinPacket,
  persistence,
  prefix,
}) => {
  const imei = topinPacket.informationContent.slice(0, 8).toString("hex").slice(-15);

  response.imei = padNumberLeft(imei, 15, "0");
  response.imei = getNormalizedIMEI(response.imei);

  const softVersion = topinPacket.informationContent.slice(-1).readUInt8(0);
  printMessage(`${prefix} 📡 received packet 0x01 from ${response.imei} (Soft Version ${softVersion})`);

  (response.response as Buffer[]).push(protoTopinCreateResponse0x01(topinPacket));

  return {
    updateLastActivity: true,
    imei: getNormalizedIMEI(imei),
    mustDisconnect: false,
  };
};

export default protoTopinProcessPacket0x01;
