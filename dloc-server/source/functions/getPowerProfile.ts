import { PowerProfileType } from "../enums/PowerProfileType";
import { Persistence } from "../models/Persistence";
import getMovementInLastSeconds from "./getMovementInLastSeconds";
import { printMessage } from "./printMessage";
import updatePowerProfile from "./updatePowerProfile";

// TODO: [VERIFY] Check movement type parameter working correctly

const MOVEMENTS_CONTROL_SECONDS: number = 300;
// Nos aseguramos de refrescos periodicos de los datos del perfil de bateria
const REFRESH_POWER_PROFILE_SECONDS: number = MOVEMENTS_CONTROL_SECONDS * 5; // How often to refresh the power profile in seconds
// Duración del tiempo en que se estará enviando la posicion desde el dispositivo. Este valor sirve para configurar el periodo de duracion del active tracking.
const REFRESH_POWER_PROFILE_EXTEND_SECONDS: number = REFRESH_POWER_PROFILE_SECONDS * 2;

const MOVEMENTS_MTS_FOR_BALANCED: number = 50;
const MOVEMENTS_MTS_FOR_MINIMAL: number = 10;

const MOVEMENT_MESURE: "distance" | "perimeter" = "perimeter";

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
    const lastPowerProfileCheckedDiffSec = (Date.now() - lastPowerProfileChecked) / 1000;
    const lastPowerProfileCheckedDiff = lastPowerProfileCheckedDiffSec >= MOVEMENTS_CONTROL_SECONDS;

    const isAutomatic = [
      PowerProfileType.AUTOMATIC_FULL,
      PowerProfileType.AUTOMATIC_BALANCED,
      PowerProfileType.AUTOMATIC_MINIMAL,
    ].includes(newPowerProfileType);

    /* Nothing to do, the power profile is not set to automatic */
    if (!isAutomatic) {
      /* Update las check */
      lastPowerProfileChecked = Date.now();

      printMessage(
        `${messagePrefix} ⚡️ power profile is not automatic, using [${newPowerProfileType}] without changes`
      );
      return {
        newPowerProfileType,
        powerProfileChanged: false,
        lastPowerProfileChecked,
        needProfileRefresh: false,
        movementsControlSeconds: REFRESH_POWER_PROFILE_EXTEND_SECONDS,
      };
    }

    /* Power upgrade to full requested by user (FULL profile in database, minimal or balanced in local cache) */
    if (
      !isNewConnection &&
      currentPowerProfileType !== newPowerProfileType &&
      newPowerProfileType === PowerProfileType.AUTOMATIC_FULL
    ) {
      lastPowerProfileChecked = Date.now();

      powerProfileChanged = true;

      printMessage(
        `${messagePrefix} ⚡️ ⚠️ power profile changed by user from [${currentPowerProfileType}] to [${newPowerProfileType}]`
      );
    }

    if (!powerProfileChanged && lastPowerProfileCheckedDiff) {
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
      if (!changed) newPowerProfileType = currentPowerProfileType;
      else {
        message = `power profile automatically changed from [${currentPowerProfileType}] to [${newPowerProfileType}]`;
      }
    } else {
      message = `power profile for device [${newPowerProfileType}]`;
    }
    printMessage(`${messagePrefix} ⚡️ ${message}`);

    /* Remember that the power profile should be refreshed */
    needProfileRefresh = !powerProfileChanged && lastPowerProfileCheckedDiffSec >= REFRESH_POWER_PROFILE_SECONDS;
    if (needProfileRefresh) {
      lastPowerProfileChecked = Date.now();
      
      printMessage(
        `${messagePrefix} 🔄 power profile refresh needed, last check was [${lastPowerProfileCheckedDiffSec} sec] ago`
      );
    }

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
    movementsControlSeconds: REFRESH_POWER_PROFILE_EXTEND_SECONDS, // Send double time to be shure the profile is refreshed
  };
}

export default getPowerProfile;
