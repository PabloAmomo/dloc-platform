import { PowerProfileType } from "../enums/PowerProfileType";
import { Persistence } from "../models/Persistence";
import { printMessage } from "./printMessage";
import updatePowerProfile from "./updatePowerProfile";

async function GetPowerProfile(
  imei: string,
  persistence: Persistence,
  errorPrefix: string
): Promise<PowerProfileType> {
  let powerProfile = PowerProfileType.AUTOMATIC_FULL;
  try {
    const powerPrf = await persistence.getPowerProfile(imei);
    const profileChanged = false;

    /* Check if the response is valid */
    if (powerPrf.error) throw powerPrf.error;

    /* Set the power profile */
    if (powerPrf?.results[0]?.powerProfile)
      powerProfile =
        powerPrf.results[0].powerProfile.toLowerCase() as PowerProfileType;

    /* Check if the power profile must be changed */
    if (
      powerProfile === PowerProfileType.AUTOMATIC_FULL ||
      powerProfile === PowerProfileType.AUTOMATIC_BALANCED ||
      powerProfile === PowerProfileType.AUTOMATIC_MINIMAL
    ) {
      // TODO: Check if the power profile is changed
    }

    /* Save the new power profile (If was changed) */
    if (profileChanged)
      await updatePowerProfile(imei, powerProfile, persistence, errorPrefix);

    printMessage(
      `${errorPrefix} 🔋 power profile for device [${powerProfile}]`
    );
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
