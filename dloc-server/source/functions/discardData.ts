import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { HandlePacketResult } from "../models/HandlePacketResult";
import { Persistence } from "../models/Persistence";
import { handlePacketOnError } from "./handlePacketOnError";
import { printMessage } from "./printMessage";

async function discardData(
  message: string,
  reportError: boolean,
  persistence: Persistence,
  imeiTemp: string,
  remoteAddress: string,
  data: string,
  response: HandlePacketResult
): Promise<HandlePacketResult> {
  /** Report error (or not) */
  response.error = reportError ? message : "";

  /** Discarted packet */
  printMessage(
    `[${imeiTemp}] (${remoteAddress}) discarted data (${message}) [${
      data.length > 20 ? data.substring(0, 40) + "..." : data
    }]`
  );

  /** Persist discarted packet */
  await persistence
    .addDiscarted(response.imei, remoteAddress, message, data)
    .then((result: PersistenceResult) => {
      result.error &&
        handlePacketOnError({
          imei: imeiTemp,
          remoteAddress,
          data,
          persistence,
          name: "discarted",
          error: result.error,
        });
    });

  return response;
}

export default discardData;
