import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { HandlePacketResult } from "../models/HandlePacketResult";
import { Persistence } from "../models/Persistence";
import { handlePacketOnError } from "./handlePacketOnError";

async function updateActivityAndAddHistory(
  updateLastActivity: boolean,
  persistence: Persistence,
  imeiTemp: string,
  remoteAdd: string,
  data: string,
  response: HandlePacketResult
): Promise<void> {
  /** Update last activity */
  if (updateLastActivity) {
    await persistence
      .updateLastActivity(response.imei)
      .then((result: PersistenceResult) => {
        result.error &&
          handlePacketOnError({
            imei: imeiTemp,
            remoteAdd,
            data,
            persistence,
            name: "lastActivity",
            error: result.error,
          });
      });
  }

  /** Add history */
  await persistence
    .addHistory(response.imei, remoteAdd, data, response.response)
    .then((result: PersistenceResult) => {
      result.error &&
        handlePacketOnError({
          imei: imeiTemp,
          remoteAdd,
          data,
          persistence,
          name: "history",
          error: result.error,
        });
    });
}

export default updateActivityAndAddHistory;
