import { HandleDataProps } from "../../../../models/HandleDataProps";
import { HandlePacketResult } from "../../../../models/HandlePacketResult";
import { printMessage } from "../../../../functions/printMessage";
import { getNormalizedIMEI } from "../../../../functions/getNormalizedIMEI";
import convertStringToHexString from "../../../../functions/convertStringToHexString";
import huabaoFrameDecode from "../../../../functions/huabaoFrameDecode";

const handleData = async ({
  imei,
  remoteAddress,
  data,
  handlePacket,
  persistence,
}: HandleDataProps): Promise<HandlePacketResult> => {
  /** results */
  let result: HandlePacketResult = {  imei, error: "", response: Buffer.from([]) };

  const dataString: string = convertStringToHexString(data);
  printMessage(
    `[---------------] (${remoteAddress}) 📡 RECEIVED ----> [${dataString}].`
  );

  // crea una algoritmo que parta los mensajes que llegan en data, que comienzan y terminan con el byte 7e
  let inPacket: Buffer | null = huabaoFrameDecode(data as Buffer);

  if (!inPacket) {
    printMessage(
      `[${getNormalizedIMEI(
        imei
      )}] (${remoteAddress}) ❌ error decoding packet.`
    );
    return result;
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
    }).then((resultVal: HandlePacketResult) => {
      /** Save result */
      result = resultVal;
      /** Error handling packet */
      if (resultVal.error !== "") throw new Error(resultVal.error);
      /** Update imei */
      if (resultVal.imei !== "") imei = resultVal.imei;
    });
  } catch (err: Error | any) {
    const printImei = getNormalizedIMEI(imei);
    printMessage(
      `[${printImei}] (${remoteAddress}) ❌ error handling packet (1) (${
        err?.message ?? "unknown error"
      }) packet [${dataString}]`
    );
  }

  /** Return results */
  return result;
};

export default handleData;
