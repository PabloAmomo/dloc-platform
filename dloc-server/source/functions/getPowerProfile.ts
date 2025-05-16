import { PowerProfileType } from "../enums/PowerProfileType";
import { Persistence } from "../models/Persistence";
import getMovementInLastSeconds from "./getMovementInLastSeconds";
import { printMessage } from "./printMessage";
import updatePowerProfile from "./updatePowerProfile";

const MOVEMENTS_CONTROL_SECONDS: number = 300;
const MOVEMENTS_MTS_FOR_BALANCED: number = 50;
const MOVEMENTS_MTS_FOR_MINIMAL: number = 10;

async function getPowerProfile(
  imei: string,
  persistence: Persistence,
  messagePrefix: string
): Promise<PowerProfileType> {
  let powerProfile = PowerProfileType.AUTOMATIC_FULL;
  try {
    const powerPrf = await persistence.getPowerProfile(imei);
    let profileChanged = false;

    /* Check if the response is valid */
    if (powerPrf.error) throw powerPrf.error;

    /* Set the power profile */
    if (powerPrf?.results[0]?.powerProfile)
      powerProfile =
        powerPrf.results[0].powerProfile.toLowerCase() as PowerProfileType;

    /** Get the movement in last seconds */
    const metersMoveInLastSeconds = await getMovementInLastSeconds(
      imei,
      MOVEMENTS_CONTROL_SECONDS,
      persistence,
      messagePrefix
    );
    printMessage(
      `${messagePrefix} 🚶‍♂️ movement in last ${MOVEMENTS_CONTROL_SECONDS} seconds [${metersMoveInLastSeconds} meters]`
    );

    /* Check if the power profile must be changed */
    const oldPowerProfile = powerProfile;
    if (
      powerProfile === PowerProfileType.AUTOMATIC_FULL ||
      powerProfile === PowerProfileType.AUTOMATIC_BALANCED ||
      powerProfile === PowerProfileType.AUTOMATIC_MINIMAL
    ) {
      /** Change to balanced power profile */
      if (
        powerProfile === PowerProfileType.AUTOMATIC_FULL &&
        metersMoveInLastSeconds < MOVEMENTS_MTS_FOR_BALANCED
      ) {
        powerProfile = PowerProfileType.AUTOMATIC_BALANCED;
        profileChanged = true;
      } else if (
      /** Change to minimal power profile */
        powerProfile === PowerProfileType.AUTOMATIC_BALANCED &&
        metersMoveInLastSeconds < MOVEMENTS_MTS_FOR_MINIMAL
      ) {
        powerProfile = PowerProfileType.AUTOMATIC_MINIMAL;
        profileChanged = true;
      } else if (
      /** Change to balanced power profile */
        powerProfile === PowerProfileType.AUTOMATIC_MINIMAL &&
        metersMoveInLastSeconds > MOVEMENTS_MTS_FOR_MINIMAL
      ) {
        powerProfile = PowerProfileType.AUTOMATIC_BALANCED;
        profileChanged = true;
      } else if (
      /** Change to full power profile */
        powerProfile === PowerProfileType.AUTOMATIC_BALANCED &&
        metersMoveInLastSeconds > MOVEMENTS_MTS_FOR_BALANCED
      ) {
        powerProfile = PowerProfileType.AUTOMATIC_FULL;
        profileChanged = true;
      }
    }

    /* Save the new power profile (If was changed) */
    if (profileChanged) {
      const changed = await updatePowerProfile(
        imei,
        powerProfile,
        persistence,
        messagePrefix
      );
      if (changed)
        printMessage(
          `${messagePrefix} ⚡️ power profile automatically changed from [${oldPowerProfile}] to [${powerProfile}]`
        );
    }

    printMessage(
      `${messagePrefix} 🔋 power profile for device [${powerProfile}]`
    );
  } catch (error: any) {
    printMessage(
      `${messagePrefix} ❌ error getting power profile [${
        error?.message ?? error
      }]`
    );
  }

  return powerProfile;
}

export default getPowerProfile;
