import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { printMessage } from "./printMessage";

async function positionUpdateBatteryAndLastActivity(
  imei: string,
  remoteAddress: string,
  persistence: Persistence,
  batteryLevel: number
): Promise<string> {
  let message: string = "ok";

  if (batteryLevel >= 0) {
    await persistence
      .addBatteryLevel(imei, batteryLevel)
      .then((result: PersistenceResult) => {
        if (result.error) {
          message = result.error.message;
          printMessage(
            `[${imei}] (${remoteAddress}) ❌ error updating battery level [Only battery Level] (addBatteryLevel) [${
              result.error?.message || result.error
            }]`
          );
        }
      });
    return message;
  }

  /** Update last activity */
  await persistence
    .updateLastActivity(imei)
    .then((result: PersistenceResult) => {
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

export default positionUpdateBatteryAndLastActivity;
