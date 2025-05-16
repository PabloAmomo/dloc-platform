import { PowerProfileType } from "../enums/PowerProfileType";
import { Persistence } from "../models/Persistence";
import { printMessage } from "./printMessage";

async function GetPowerProfile(
  imei: string,
  persistence: Persistence,
  errorPrefix: string
): Promise<PowerProfileType> {
  let powerProfile = PowerProfileType.AUTOMATIC_FULL;
  try {
    const powerPrf = await persistence.getPowerProfile(imei);

    if (powerPrf.error) {
      printMessage(
        `${errorPrefix} ❌ error getting power profile [${
          powerPrf.error?.message || powerPrf.error
        }]`
      );
    } else {
      powerProfile = (
        powerPrf?.results[0]?.powerProfile ?? "MINIMAL"
      ).toLowerCase() as PowerProfileType;

      printMessage(
        `${errorPrefix} 🔋 power profile for device [${powerProfile}]`
      );
    }
  } catch (error: any) {
    printMessage(
      `${errorPrefix} ❌ error getting power profile [${
        error?.message ?? error
      }]`
    );
  }

  return powerProfile;
}

export default GetPowerProfile;
