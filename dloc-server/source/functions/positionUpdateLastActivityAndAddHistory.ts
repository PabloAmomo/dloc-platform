import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { printMessage } from "./printMessage";

async function positionUpdateLastActivityAndAddHistory(
  imei: string,
  remoteAddress: string,
  packetRawData: string,
  persistence: Persistence,
  updateLastActivity: boolean,
  onErrorUpdateLastActivity?: (error : Error) => void,
  onErrorAddHistory?: (error : Error) => void
): Promise<string> {
  var message: string = "ok";

  /** Update last activity */
  if (updateLastActivity) {
    await persistence
      .updateLastActivity(imei)
      .then((result: PersistenceResult) => {
        if (result.error) {
          message = result.error.message;
          printMessage(
            `[${imei}] (${remoteAddress}) error updating last activity (updateLastActivity) [${
              result.error?.message || result.error
            }]`
          );
          onErrorUpdateLastActivity && onErrorUpdateLastActivity(result.error);
        }
      });
    if (message !== "ok") return message;
  }

  /** Add history */
  await persistence
    .addHistory(imei, remoteAddress, packetRawData, "")
    .then((result: PersistenceResult) => {
      if (result.error) {
        message = result.error.message;
        printMessage(
          `[${imei}] (${remoteAddress}) error persisting history (addHistory) [${
            result.error?.message || result.error
          }]`
        );
        onErrorAddHistory && onErrorAddHistory(result.error);
      }
    });

  return message;
}

export default positionUpdateLastActivityAndAddHistory;
