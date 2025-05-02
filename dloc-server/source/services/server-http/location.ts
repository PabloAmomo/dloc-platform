import locationAddPositionAndUpdateDevice from "../../functions/locationAddPositionAndUpdateDevice";
import locationUpdateLastActivityAndAddHistory from "../../functions/locationUpdateLastActivityAndAddHistory";
import { printMessage } from "../../functions/printMessage";
import updateActivityAndAddHistory from "../../functions/updateActivityAndAddHistory";
import updateDeviceAndAddPosition from "../../functions/updateDeviceAndAddPosition";
import { CACHE_LOCATION } from "../../infraestucture/caches/cacheLocation";
import { PersistenceResult } from "../../infraestucture/models/PersistenceResult";
import { Persistence } from "../../models/Persistence";
import { PositionPacket } from "../../models/PositionPacket";

const location = async (
  persistence: Persistence,
  positionPacket: PositionPacket
) => {
  const { imei, remoteAddress } = positionPacket;
  var message: string = "ok";
  var noHasLocation: boolean =
    positionPacket.lat === -999 || positionPacket.lng === -999;
  var hasBatteryLevel: boolean = positionPacket.batteryLevel != 0;

  if (noHasLocation) {
    if (hasBatteryLevel) {
      /** Update battery level */
      await persistence
        .addBatteryLevel(imei, positionPacket.batteryLevel)
        .then((result: PersistenceResult) => {
          if (result.error) {
            message = result.error.message;
            printMessage(
              `[${imei}] (${remoteAddress}) error updating battery level [Only battery Level] (addBatteryLevel) [${
                result.error?.message || result.error
              }]`
            );
          }
        });
    } else {
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
    }

    return { code: message === "ok" ? 200 : 500, result: { message } };
  }

  message = await locationAddPositionAndUpdateDevice(
    imei,
    remoteAddress,
    positionPacket,
    persistence
  );

  if (message === "ok")
    message = await locationUpdateLastActivityAndAddHistory(
      imei,
      remoteAddress,
      positionPacket,
      persistence
    );

  /** */
  return { code: message === "ok" ? 200 : 500, result: { message } };
};

export { location };
