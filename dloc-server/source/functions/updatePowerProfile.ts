import { PowerProfileType } from "../enums/PowerProfileType";
import { PersistenceResult } from "../infraestucture/models/PersistenceResult";
import { Persistence } from "../models/Persistence";
import { printMessage } from "./printMessage";

async function updatePowerProfile(
  imei: string,
  powerProfile: PowerProfileType,
  persistence: Persistence,
  errorPrefix: string
): Promise<boolean> {
  let response: boolean = true;

  await persistence
    .updatePowerProfile(imei, powerProfile)
    .then((result: PersistenceResult) => {
      if (result.error) {
        response = false;
        printMessage(
          `${errorPrefix} ❌ error updating power profile to (${powerProfile}) [${
            result.error?.message || result.error
          }]`
        );
      }
    });

  if (response)
    printMessage(
      `${errorPrefix} ⚡️ power profile updated on database to (${powerProfile})`
    );

  return response;
}

export default updatePowerProfile;
