import { HandleDataProps } from '../../../../models/HandleDataProps';
import { HandlePacketResult } from '../../../../models/HandlePacketResult';
import { printMessage } from '../../../../functions/printMessage';
import { getNormalizedIMEI } from '../../../../functions/getNormalizedIMEI';
import splitJT808Frames from '../../../../functions/splitJT808Frames';

const handleData = async ({ imei, remoteAddress, data, handlePacket, persistence }: HandleDataProps): Promise<HandlePacketResult[]> => {
  /** Save results */
  const results: HandlePacketResult[] = [];

  // crea una algoritmo que parta los mensajes que llegan en data, que comienzan y terminan con el byte 7e
  const inPackets: any[] = data  ? splitJT808Frames(data) : [];

  /** Process each packet */
  for (let i = 0; i < inPackets.length; i++) {
    /** Discart empty packets */
    if (inPackets[i] == '') continue;

    /** Handle packet */
    try {
      await handlePacket({ imei, remoteAddress, data: inPackets[i] + '#', persistence }).then((result: HandlePacketResult) => {
        /** Save result */
        results.push(result);
        /** Error handling packet */
        if (result.error !== '') throw new Error(result.error);
        /** Update imei */
        if (result.imei !== '') imei = result.imei;
      });
    } catch (err: Error | any) {
      const printImei = getNormalizedIMEI(imei);
      printMessage(`[${printImei}] (${remoteAddress}) ❌ error handling packet (1) (${err?.message ?? 'unknown error'}) packet [${inPackets[i]?.split(',')?.[0] ?? inPackets[i]}]`);
    }
  }

  /** Return results */
  return results;
};

export default handleData;
