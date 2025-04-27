import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { HandlePacketResult } from "../models/HandlePacketResult";
import { Persistence } from "../models/Persistence";
import { handlePacketOnError } from "./handlePacketOnError";

async function updateBattery(
  data: string,
  persistence: Persistence,
  response: HandlePacketResult,
  imeiTemp: string,
  remoteAdd: string
): Promise<void> {
  const batteryLevel: number = parseInt(data.substring(14, 17) ?? "0");

  await persistence
    .addBatteryLevel(response.imei, batteryLevel)
    .then((result: PersistenceResult) => {
      result.error &&
        handlePacketOnError({
          imei: imeiTemp,
          remoteAdd,
          data,
          persistence,
          name: "batteryLevel",
          error: result.error,
        });
    });
}

export default updateBattery;
