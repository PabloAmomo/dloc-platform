import { CACHE_LOCATION } from "../infraestucture/caches/cacheLocation";
import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { PositionPacket } from "../models/PositionPacket";
import { printMessage } from "./printMessage";

async function locationAddPositionAndUpdateDevice(
  imei: string,
  remoteAddress: string,
  positionPacket: PositionPacket,
  persistence: Persistence
): Promise<string> {
  var message: string = "ok";

  /** Add location packet to cache */
  printMessage(
    `[${imei}] (${remoteAddress}) updating device [${JSON.stringify(
      positionPacket
    )}]`
  );
  CACHE_LOCATION.set(imei, positionPacket);

  /** Add position */
  await persistence
    .addPosition(positionPacket)
    .then((result: PersistenceResult) => {
      if (result.error) {
        message = result.error.message;
        printMessage(
          `[${imei}] (${remoteAddress}) error persisting position (addPosition) [${
            result.error?.message || result.error
          }]`
        );
      }
    });
  if (message !== "ok") return message;

  /** Update device */
  await persistence
    .updateDevice(positionPacket)
    .then((result: PersistenceResult) => {
      printMessage(
        `[${imei}] (${remoteAddress}) updating device [${JSON.stringify(
          positionPacket
        )}]`
      );
      if (result.error) {
        message = result.error.message;
        printMessage(
          `[${imei}] (${remoteAddress}) error persisting position (updateDevice) [${
            result.error?.message || result.error
          }]`
        );
      }
    });

  return message;
}

export default locationAddPositionAndUpdateDevice;
