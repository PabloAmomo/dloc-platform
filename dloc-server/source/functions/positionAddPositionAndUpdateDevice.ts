import { CACHE_POSITION } from "../infraestucture/caches/cachePosition";
import { CachePosition } from "../infraestucture/models/CachePosition";
import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { PositionPacket } from "../models/PositionPacket";
import { printMessage } from "./printMessage";

async function positionAddPositionAndUpdateDevice(
  imei: string,
  remoteAddress: string,
  positionPacket: PositionPacket,
  persistence: Persistence,
  onErrorAddPosition?: (error: Error) => void,
  onErrorUpdateDevice?: (error: Error) => void
): Promise<string> {
  var message: string = "ok";

  const lastPacketTime = CACHE_POSITION.get(imei)?.dateTimeUtc?.getTime() ?? 0;
  if (lastPacketTime !== 0)
    printMessage(
      `[${imei}] (${remoteAddress}) ⏰ last position received 🌟 ${((Date.now() - lastPacketTime) / 1000).toFixed(0)} sec ago 🌟`
    );

  /** Add position packet to cache */
  printMessage(`[${imei}] (${remoteAddress}) ✅ updating cache [${JSON.stringify(positionPacket)}]`);
  CACHE_POSITION.set(imei, { ...positionPacket, dateTimeUtc: new Date() });

  /** Add position */
  await persistence.addPosition(positionPacket).then((result: PersistenceResult) => {
    if (result.error) {
      message = result.error.message;
      printMessage(
        `[${imei}] (${remoteAddress}) ❌ error persisting position (addPosition) [${
          result.error?.message || result.error
        }]`
      );

      onErrorAddPosition && onErrorAddPosition(result.error);
    }
  });
  if (message !== "ok") return message;

  /** Update device */
  await persistence.updateDevice(positionPacket).then((result: PersistenceResult) => {
    printMessage(`[${imei}] (${remoteAddress}) ✅ updating device [${JSON.stringify(positionPacket)}]`);
    if (result.error) {
      message = result.error.message;
      printMessage(
        `[${imei}] (${remoteAddress}) ❌ error persisting position (updateDevice) [${
          result.error?.message || result.error
        }]`
      );

      onErrorUpdateDevice && onErrorUpdateDevice(result.error);
    }
  });

  return message;
}

export default positionAddPositionAndUpdateDevice;
