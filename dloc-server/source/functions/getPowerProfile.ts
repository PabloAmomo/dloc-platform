import { PowerProfileType } from "../enums/PowerProfileType";
import { Persistence } from "../models/Persistence";
import getMovementInLastSeconds from "./getMovementInLastSeconds";
import { printMessage } from "./printMessage";
import updatePowerProfile from "./updatePowerProfile";

const MOVEMENTS_CONTROL_SECONDS: number = 300;
const MOVEMENTS_MTS_FOR_BALANCED: number = 50;
const MOVEMENTS_MTS_FOR_MINIMAL: number = 10;

// TODO: [VERIFY] When the user switches to the maximum power profile, we don't know that the change was made by the user, and the duration lasts only one minute.

// TODO: [FEATURE] Check if the movement exceeds X meters from the first position [Modify or create new getMovementInLastSeconds] (currently, it sums up all movements).

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
    await updatePowerProfile(
      imei,
      newPowerProfileType,
      persistence,
      messagePrefix
    );
    printMessage(
      `${messagePrefix} 🆕 new connection, setting power profile to [${newPowerProfileType}]`
    );
  }

  try {
    const powerProfile = await persistence.getPowerProfile(imei);

    /* Check if the response is valid */
    if (powerProfile.error) throw powerProfile.error;

    /* Set the power profile */
    if (powerProfile?.results[0]?.powerProfile)
      newPowerProfileType =
        powerProfile.results[0].powerProfile.toLowerCase() as PowerProfileType;

    /* Check if the power profile must be changed */
    const lastPowerProfileCheckedDiff =
      Date.now() - lastPowerProfileChecked > 1000 * MOVEMENTS_CONTROL_SECONDS;

    const isAutomatic =
      newPowerProfileType === PowerProfileType.AUTOMATIC_FULL ||
      newPowerProfileType === PowerProfileType.AUTOMATIC_BALANCED ||
      newPowerProfileType === PowerProfileType.AUTOMATIC_MINIMAL;

    /* Power upgrade to full requested by user (FULL profile in database, minimal or balanced in local cache) */
    if (
      !isNewConnection &&
      isAutomatic &&
      currentPowerProfileType !== newPowerProfileType &&
      newPowerProfileType !== PowerProfileType.AUTOMATIC_FULL
    ) {
      powerProfileChanged = true;
      printMessage(
        `${messagePrefix} ⚡️ ⚠️ power profile changed by user from [${currentPowerProfileType}] to [${newPowerProfileType}]`
      );
    }

    if (isAutomatic && !powerProfileChanged && lastPowerProfileCheckedDiff) {
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
      const changed = await updatePowerProfile(
        imei,
        newPowerProfileType,
        persistence,
        messagePrefix
      );
      if (!changed) newPowerProfileType = currentPowerProfileType;
      else {
        lastPowerProfileChecked = Date.now();
        message = `power profile automatically changed from [${currentPowerProfileType}] to [${newPowerProfileType}]`;
      }
    } else {
      message = `power profile for device [${newPowerProfileType}]`;
    }
    printMessage(`${messagePrefix} ⚡️ ${message}`);

    //
  } catch (error: any) {
    const errorMsg = error?.message ?? error;
    printMessage(
      `${messagePrefix} ❌ error getting power profile [${errorMsg}]`
    );
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
