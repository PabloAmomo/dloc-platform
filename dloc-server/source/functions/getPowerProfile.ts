import { PowerProfileType } from "../enums/PowerProfileType";
import { Persistence } from "../models/Persistence";
import getMovementInLastSeconds from "./getMovementInLastSeconds";
import { printMessage } from "./printMessage";
import updatePowerProfile from "./updatePowerProfile";

const MOVEMENTS_CONTROL_SECONDS: number = 300;
const MOVEMENTS_MTS_FOR_BALANCED: number = 50;
const MOVEMENTS_MTS_FOR_MINIMAL: number = 10;

const MOVEMENT_MESURE: "distance" | "perimeter" = "perimeter";

// TODO: [VERIFY] Check movement type parameter working correctly

async function getPowerProfile(
  imei: string,
  persistence: Persistence,
  lastPowerProfileChecked: number,
  messagePrefix: string,
  isNewConnection: boolean,
  currentPowerProfileType: PowerProfileType
): Promise<{
  newPowerProfileType: PowerProfileType;
  powerProfileChanged: boolean;
  lastPowerProfileChecked: number;
  needProfileRefresh: boolean;
  movementsControlSeconds: number;
}> {
  let newPowerProfileType = PowerProfileType.AUTOMATIC_FULL;
  let powerProfileChanged = false;
  let needProfileRefresh = false;

  if (lastPowerProfileChecked === 0) lastPowerProfileChecked = Date.now();

  if (isNewConnection) {
    await updatePowerProfile(imei, newPowerProfileType, persistence, messagePrefix);
    printMessage(`${messagePrefix} 🆕 new connection, setting power profile to [${newPowerProfileType}]`);
  }

  try {
    const powerProfile = await persistence.getPowerProfile(imei);

    /* Check if the response is valid */
    if (powerProfile.error) throw powerProfile.error;

    /* Set the power profile */
    if (powerProfile?.results[0]?.powerProfile)
      newPowerProfileType = powerProfile.results[0].powerProfile.toLowerCase() as PowerProfileType;

    /* Check if the power profile must be changed */
    const lastPowerProfileCheckedDiff = Date.now() - lastPowerProfileChecked > 1000 * MOVEMENTS_CONTROL_SECONDS;

    const isAutomatic = [
      PowerProfileType.AUTOMATIC_FULL,
      PowerProfileType.AUTOMATIC_BALANCED,
      PowerProfileType.AUTOMATIC_MINIMAL,
    ].includes(newPowerProfileType);

    /* Power upgrade to full requested by user (FULL profile in database, minimal or balanced in local cache) */
    if (
      !isNewConnection &&
      isAutomatic &&
      currentPowerProfileType !== newPowerProfileType &&
      newPowerProfileType === PowerProfileType.AUTOMATIC_FULL
    ) {
      powerProfileChanged = true;
      lastPowerProfileChecked = Date.now();
      printMessage(
        `${messagePrefix} ⚡️ ⚠️ power profile changed by user from [${currentPowerProfileType}] to [${newPowerProfileType}]`
      );
    }

    if (isAutomatic && !powerProfileChanged && lastPowerProfileCheckedDiff) {
      needProfileRefresh = lastPowerProfileCheckedDiff;
      lastPowerProfileChecked = Date.now();

      /** Get the movement in last seconds */
      const metersMoveInLastSeconds = await getMovementInLastSeconds(
        imei,
        MOVEMENTS_CONTROL_SECONDS,
        persistence,
        messagePrefix,
        MOVEMENT_MESURE
      );

      printMessage(
        `${messagePrefix} 🚶‍♂️ movement (${MOVEMENT_MESURE}) in last ${MOVEMENTS_CONTROL_SECONDS} seconds [${metersMoveInLastSeconds} meters]`
      );

      /** Change to balanced power profile */
      if (
        newPowerProfileType === PowerProfileType.AUTOMATIC_FULL &&
        metersMoveInLastSeconds < MOVEMENTS_MTS_FOR_BALANCED
      ) {
        newPowerProfileType = PowerProfileType.AUTOMATIC_BALANCED;
        powerProfileChanged = true;
      } else if (
        /** Change to minimal power profile */
        newPowerProfileType === PowerProfileType.AUTOMATIC_BALANCED &&
        metersMoveInLastSeconds < MOVEMENTS_MTS_FOR_MINIMAL
      ) {
        newPowerProfileType = PowerProfileType.AUTOMATIC_MINIMAL;
        powerProfileChanged = true;
      } else if (
        /** Change to balanced power profile */
        newPowerProfileType === PowerProfileType.AUTOMATIC_MINIMAL &&
        metersMoveInLastSeconds > MOVEMENTS_MTS_FOR_MINIMAL
      ) {
        newPowerProfileType = PowerProfileType.AUTOMATIC_BALANCED;
        powerProfileChanged = true;
      } else if (
        /** Change to full power profile */
        newPowerProfileType === PowerProfileType.AUTOMATIC_BALANCED &&
        metersMoveInLastSeconds > MOVEMENTS_MTS_FOR_BALANCED
      ) {
        newPowerProfileType = PowerProfileType.AUTOMATIC_FULL;
        powerProfileChanged = true;
      }
    }

    /* Save the new power profile (If was changed) */
    let message = "";
    if (powerProfileChanged) {
      const changed = await updatePowerProfile(imei, newPowerProfileType, persistence, messagePrefix);
      if (!changed) {
        lastPowerProfileChecked = Date.now() - 1000 * 120; // Force to check again in 2 minutes
        newPowerProfileType = currentPowerProfileType;
      } else {
        message = `power profile automatically changed from [${currentPowerProfileType}] to [${newPowerProfileType}]`;
      }
    } else {
      message = `power profile for device [${newPowerProfileType}]`;
    }
    printMessage(`${messagePrefix} ⚡️ ${message}`);

    //
  } catch (error: any) {
    const errorMsg = error?.message ?? error;
    printMessage(`${messagePrefix} ❌ error getting power profile [${errorMsg}]`);
  }

  return {
    newPowerProfileType,
    powerProfileChanged,
    lastPowerProfileChecked,
    needProfileRefresh,
    movementsControlSeconds: MOVEMENTS_CONTROL_SECONDS,
  };
}

export default getPowerProfile;
