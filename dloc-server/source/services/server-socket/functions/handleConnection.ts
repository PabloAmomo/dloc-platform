import convertAnyToHexString from "../../../functions/convertAnyToHexString";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import { printMessage } from "../../../functions/printMessage";
import HandleConnectionProps from "../models/HandleConnectionProp";
import HandlePacketResult from "../models/HandlePacketResult";

const handleConnection = async ({
  imei,
  remoteAddress,
  data,
  handlePacket,
  persistence,
  counter,
  disconnect,
}: HandleConnectionProps): Promise<HandlePacketResult[]> => {
  /** results */
  const results: HandlePacketResult[] = [];

  if (data.length === 0) {
    printMessage(
      `[${getNormalizedIMEI(
        imei
      )}] (${remoteAddress}) ❌ error decoding packet.`
    );
    return results;
  }

  const isBuffer = Buffer.isBuffer(data[0]);

  /** Process each packet */
  for (let i = 0; i < data.length; i++) {
    /** Discart empty packets */
    if (!data[i] || data[i].length === 0) continue;

    if (!isBuffer) data[i] = data[i];

    /** Handle packet */
    try {
      await handlePacket({
        imei,
        remoteAddress,
        data: data[i] as any,
        persistence,
        counter,
        disconnect,
      }).then((result: HandlePacketResult) => {
        /** Save result */
        results.push(result);
        /** Error handling packet */
        if (result.error !== "") throw new Error(result.error);
        /** Update imei */
        if (result.imei !== "") imei = result.imei;
      });
    } catch (err: Error | any) {
      printMessage(
        `[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ error handling packet (1) (${
          err?.message ?? "unknown error"
        }) packet [${isBuffer ? convertAnyToHexString(data[i]) : ((data[i] as string)?.split(",")?.[0] ?? data[i])}]`
      );
    }
  }

  /** Return results */
  return results;
};

export default handleConnection;
