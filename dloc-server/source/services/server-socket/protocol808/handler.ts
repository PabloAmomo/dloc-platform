import { HandlePacketResult } from "../../../models/HandlePacketResult";
import { printMessage } from "../../../functions/printMessage";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import convertStringToHexString from "../../../functions/convertStringToHexString";
import jt808FrameDecode from "./functions/jt808FrameDecode";
import { Jt808HandlerProps } from "./models/Jt808HandlerProps";

const handler = async ({
  imei,
  remoteAddress,
  data,
  handlePacket,
  persistence,
  counter,
}: Jt808HandlerProps): Promise<HandlePacketResult[]> => {
  /** results */
  const results: HandlePacketResult[] = [];

  // TODO: Unificar handlers para protocolo 808 y 1903

  const inPackets: Buffer[] = [jt808FrameDecode(data)];

  if (inPackets.length === 0) {
    printMessage(
      `[${getNormalizedIMEI(
        imei
      )}] (${remoteAddress}) ❌ error decoding packet.`
    );
    return results;
  }

  /** Process each packet */
  for (let i = 0; i < inPackets.length; i++) {
    /** Discart empty packets */
    if (!inPackets[i]) continue;

    /** Handle packet */
    try {
      await handlePacket({
        imei,
        remoteAddress,
        data: inPackets[i],
        persistence,
        counter,
      }).then((result: HandlePacketResult) => {
        /** Save result */
        results.push(result);
        /** Error handling packet */
        if (result.error !== "") throw new Error(result.error);
        /** Update imei */
        if (result.imei !== "") imei = result.imei;
      });
    } catch (err: Error | any) {
      const printImei = getNormalizedIMEI(imei);
      printMessage(
        `[${printImei}] (${remoteAddress}) ❌ error handling packet (1) (${
          err?.message ?? "unknown error"
        }) packet [${convertStringToHexString(inPackets[i])}]`
      );
    }
  }

  /** Return results */
  return results;
};

export default handler;
