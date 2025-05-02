import { HandlePacketResult } from "./../models/HandlePacketResult";
import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { PositionPacket } from "../models/PositionPacket";
import discardData from "./discardData";
import { handlePacketOnError } from "./handlePacketOnError";
import { printMessage } from "./printMessage";
import { CACHE_LOCATION } from "../infraestucture/caches/cacheLocation";

async function updateDeviceAndAddPosition(
  locationPacket: PositionPacket,
  persistence: Persistence,
  imeiTemp: string,
  remoteAdd: string,
  data: string,
  response: HandlePacketResult
): Promise<HandlePacketResult> {

  /** Add location packet to cache */
  printMessage(
    `[${imeiTemp}] (${remoteAdd}) updating device [${JSON.stringify(
      locationPacket
    )}]`
  );
  CACHE_LOCATION.set(imeiTemp, locationPacket);

  /** Add position */
  await persistence
    .addPosition(locationPacket)
    .then((result: PersistenceResult) => {
      result.error &&
        handlePacketOnError({
          imei: imeiTemp,
          remoteAdd,
          data,
          persistence,
          name: "position",
          error: result.error,
        });
    });

  /** Update device */
  const oldPacketMessage = "old packet";
  let isOldPacket = false;
  await persistence
    .updateDevice(locationPacket)
    .then((result: PersistenceResult) => {
      /** Report error (or not) */
      result.error &&
        handlePacketOnError({
          imei: imeiTemp,
          remoteAdd,
          data,
          persistence,
          name: "update",
          error: result.error,
        });

      /** Discard old packet */
      isOldPacket = result.error?.message === oldPacketMessage;

      /** Print error */
      if (result.error)
        printMessage(
          `[${imeiTemp}] (${remoteAdd}) error updating device [${
            result.error?.message || result.error
          }]`
        );
    });

  /** Report error (or not) */
  return !isOldPacket
    ? response
    : await discardData(
        oldPacketMessage,
        true,
        persistence,
        imeiTemp,
        remoteAdd,
        data,
        response
      );
}

export default updateDeviceAndAddPosition;
