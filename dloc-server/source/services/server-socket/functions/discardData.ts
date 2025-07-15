import { handlePacketOnError } from '../../../functions/handlePacketOnError';
import { printMessage } from '../../../functions/printMessage';
import { PersistenceResult } from '../../../infraestucture/models/PersistenceResult';
import { Persistence } from '../../../models/Persistence';
import HandlePacketResult from '../models/HandlePacketResult';

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
    `[${imeiTemp}] (${remoteAddress}) ❌ discarted data (${message}) [${
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
          name: "discarted",
          error: result.error,
        });
    });

  return response;
}

export default discardData;
