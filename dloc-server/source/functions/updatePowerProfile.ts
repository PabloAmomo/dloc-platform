import { PowerProfileType } from "../enums/PowerProfileType";
import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { printMessage } from "./printMessage";

async function updatePowerProfile(
  imei: string,
  remoteAddress: string,
  persistence: Persistence,
  powerProfile: PowerProfileType
): Promise<boolean> {
  let response: boolean = true;

  await persistence
    .updatePowerProfile(imei, powerProfile)
    .then((result: PersistenceResult) => {
      if (result.error) {
        response = false;
        printMessage(
          `[${imei}] (${remoteAddress}) error updating power profile to (${powerProfile}) [${
            result.error?.message || result.error
          }]`
        );
      }
    });

  return response;
}

export default updatePowerProfile;
