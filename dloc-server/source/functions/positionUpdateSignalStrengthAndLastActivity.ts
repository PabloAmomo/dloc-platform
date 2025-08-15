import { Protocols } from "../enums/Protocols";
import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { printMessage } from "./printMessage";

async function positionUpdateSignalStrengthAndLastActivity(
  imei: string,
  protocol: Protocols,
  remoteAddress: string,
  persistence: Persistence,
  signalStrength: number
): Promise<string> {
  let message: string = "ok";

  if (signalStrength >= 0) {
    await persistence.addSignalStrength(imei, signalStrength).then((result: PersistenceResult) => {
      if (result.error) {
        message = result.error.message;
        printMessage(
          `[${imei}] (${remoteAddress}) ❌ error updating Signal Strength [Only signal strength] (addSignalStrength) [${
            result.error?.message || result.error
          }]`
        );
      }
    });
    return message;
  }

  /** Update last activity */
  await persistence.updateLastActivity(imei, protocol).then((result: PersistenceResult) => {
    if (result.error) {
      message = result.error.message;
      printMessage(
        `[${imei}] (${remoteAddress}) ❌ error updating last activity (updateLastActivity) [${
          result.error?.message || result.error
        }]`
      );
    }
  });

  return message;
}

export default positionUpdateSignalStrengthAndLastActivity;
