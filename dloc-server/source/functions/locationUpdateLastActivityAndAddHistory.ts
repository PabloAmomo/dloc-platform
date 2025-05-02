import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { PositionPacket } from "../models/PositionPacket";
import { printMessage } from "./printMessage";

async function locationUpdateLastActivityAndAddHistory(
  imei: string,
  remoteAddress: string,
  positionPacket: PositionPacket,
  persistence: Persistence
): Promise<string> {
  var message: string = "ok";

  /** Update last activity */
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
      }
    });
  if (message !== "ok") return message;

  /** Add history */
  await persistence
    .addHistory(imei, remoteAddress, JSON.stringify(positionPacket), "")
    .then((result: PersistenceResult) => {
      if (result.error) {
        message = result.error.message;
        printMessage(
          `[${imei}] (${remoteAddress}) error persisting history (addHistory) [${
            result.error?.message || result.error
          }]`
        );
      }
    });
    
  return message;
}

export default locationUpdateLastActivityAndAddHistory;
