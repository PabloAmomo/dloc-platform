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
  lastPowerProfileChecked: number,
  messagePrefix: string,
  isNewConnection: boolean
): Promise<{ powerProfile: PowerProfileType; lastPowerProfileChecked: number, needProfileRefresh: boolean, movementsControlSeconds: number }> {
  let powerProfile = PowerProfileType.AUTOMATIC_FULL;
  let needProfileRefresh = false;

  if (lastPowerProfileChecked === 0) lastPowerProfileChecked = Date.now();

  if (isNewConnection) {
    await updatePowerProfile(imei, powerProfile, persistence, messagePrefix);
    printMessage(
      `${messagePrefix} 🆕 new connection, setting power profile to [${powerProfile}]`
    );
  }

  try {
    const powerPrf = await persistence.getPowerProfile(imei);
    let profileChanged = false;

    /* Check if the response is valid */
    if (powerPrf.error) throw powerPrf.error;

    /* Set the power profile */
    if (powerPrf?.results[0]?.powerProfile)
      powerProfile =
        powerPrf.results[0].powerProfile.toLowerCase() as PowerProfileType;

    /* Check if the power profile must be changed */
    const oldPowerProfile = powerProfile;
    const lastPowerProfileCheckedDiff =
      Date.now() - lastPowerProfileChecked > 1000 * MOVEMENTS_CONTROL_SECONDS;

    const isAutomatic =
      powerProfile === PowerProfileType.AUTOMATIC_FULL ||
      powerProfile === PowerProfileType.AUTOMATIC_BALANCED ||
      powerProfile === PowerProfileType.AUTOMATIC_MINIMAL;

    if (lastPowerProfileCheckedDiff && isAutomatic) {
      needProfileRefresh = true;
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

      /* Save the new power profile (If was changed) */
      lastPowerProfileChecked = Date.now();
      if (profileChanged) {
        const changed = await updatePowerProfile(
          imei,
          powerProfile,
          persistence,
          messagePrefix
        );
        if (!changed) powerProfile = oldPowerProfile;
        else {
          printMessage(
            `${messagePrefix} ⚡️ power profile automatically changed from [${oldPowerProfile}] to [${powerProfile}]`
          );
        }
      }
    }

    printMessage(
      `${messagePrefix} ⚡️ power profile for device [${powerProfile}]`
    );
  } catch (error: any) {
    printMessage(
      `${messagePrefix} ❌ error getting power profile [${
        error?.message ?? error
      }]`
    );
  }

  return { powerProfile, lastPowerProfileChecked, needProfileRefresh, movementsControlSeconds: MOVEMENTS_CONTROL_SECONDS };
}

export default getPowerProfile;
