import { HandleDataProps } from "../../../../models/HandleDataProps";
import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { printMessage } from "../../../../functions/printMessage";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import convertStringToHexString from "../../../../functions/convertStringToHexString";
import huabaoFrameDevice from "../../../../functions/huabaoFrameDecode";

const handleData = async ({
  imei,
  remoteAddress,
  data,
  handlePacket,
  persistence,
}: HandleDataProps): Promise<HandlePacketResult[]> => {
  /** results */
  const results: HandlePacketResult[] = [];

  const dataString: string = convertStringToHexString(data);
  printMessage(
    `[---------------] (${remoteAddress}) 📡 RECEIVED ----> [${dataString}].`
  );

  // crea una algoritmo que parta los mensajes que llegan en data, que comienzan y terminan con el byte 7e
  let inPacket: Buffer | null = huabaoFrameDevice(data as Buffer);

  if (!inPacket) {
    printMessage(
      `[${getNormalizedIMEI(
        imei
      )}] (${remoteAddress}) ❌ error decoding packet.`
    );
    return results;
  }

  /** Remove first byte on packet */
  if (inPacket[0] === 0x7e) inPacket = inPacket.slice(1);
  /** Remove last byte on packet */
  if (inPacket[inPacket.length - 1] === 0x7e) inPacket = inPacket.slice(0, -1);

  /** Handle packet */
  try {
    await handlePacket({
      imei,
      remoteAddress,
      data: inPacket as Buffer,
      persistence,
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
      }) packet [${convertStringToHexString(inPacket)}]`
    );
  }

  /** Return results */
  return results;
};

export default handleData;
