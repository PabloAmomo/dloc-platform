import { HandleHandlerProps } from "../../../models/HandleDataProps";
import { HandlePacketResult } from "../../../models/HandlePacketResult";
import { printMessage } from "../../../functions/printMessage";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";

const handler = async ({
  imei,
  remoteAddress,
  data,
  handlePacket,
  persistence,
  counter,
}: Omit<HandleHandlerProps, "data"> & { data: String }): Promise<
  HandlePacketResult[]
> => {
  /** Save results */
  const results: HandlePacketResult[] = [];

  const inPackets: string[] = data.split("#");

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
    if (inPackets[i] == "") continue;

    /** Handle packet */
    try {
      await handlePacket({
        imei,
        remoteAddress,
        data: inPackets[i] + "#",
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
        }) packet [${inPackets[i]?.split(",")?.[0] ?? inPackets[i]}]`
      );
      // throw err;
    }
  }

  /** Return results */
  return results;
};

export default handler;
