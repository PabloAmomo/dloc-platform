import config from "../config/config";
import { PowerProfileType } from "../enums/PowerProfileType";
import GetPowerProfileConfig from "../models/GetProwerProfileConfig";
import { Persistence } from "../models/Persistence";
import getMovementInLastSeconds from "./getMovementInLastSeconds";
import { printMessage } from "./printMessage";
import updatePowerProfile from "./updatePowerProfile";

// TODO: Refactor this function to use a more structured approach, possibly with a class or a more modular design.
async function getPowerProfile(
  imei: string,
  persistence: Persistence,
  lastPowerProfileChecked: number,
  messagePrefix: string,
  isNewConnection: boolean,
  currentPowerProfileType: PowerProfileType,
  getPowerProfileConfig: GetPowerProfileConfig
): Promise<{
  newPowerProfileType: PowerProfileType;
  powerProfileChanged: boolean;
  lastPowerProfileChecked: number;
  needProfileRefresh: boolean;
}> {
  const { MOVEMENT_MESURE, MOVEMENTS_CONTROL_SECONDS } = config;

  let newPowerProfileType = PowerProfileType.AUTOMATIC_FULL;
  let powerProfileChanged = false;
  let needProfileRefresh = false;

  if (lastPowerProfileChecked === 0) lastPowerProfileChecked = Date.now();

  try {
    if (isNewConnection) {
      await updatePowerProfile(imei, newPowerProfileType, persistence, messagePrefix);
      printMessage(`${messagePrefix} 🆕 new connection, setting power profile to [${newPowerProfileType}]`);
    }

    const powerProfile = await persistence.getPowerProfile(imei);
    if (powerProfile.error) throw powerProfile.error;

    const movementsMts = {
      full: getPowerProfileConfig(PowerProfileType.AUTOMATIC_FULL).movementMeters,
      balanced: getPowerProfileConfig(PowerProfileType.AUTOMATIC_BALANCED).movementMeters,
      minimal: getPowerProfileConfig(PowerProfileType.AUTOMATIC_MINIMAL).movementMeters,
    };

    /* Set the power profile */
    if (powerProfile?.results[0]?.powerProfile)
      newPowerProfileType = powerProfile.results[0].powerProfile.toLowerCase() as PowerProfileType;

    const isAutomatic = [
      PowerProfileType.AUTOMATIC_FULL,
      PowerProfileType.AUTOMATIC_BALANCED,
      PowerProfileType.AUTOMATIC_MINIMAL,
    ].includes(newPowerProfileType);

    /* Check if the power profile must be changed */
    const lastPowerProfileCheckedDiffSec = (Date.now() - lastPowerProfileChecked) / 1000;
    const lastPowerProfileCheckedDiff = lastPowerProfileCheckedDiffSec >= MOVEMENTS_CONTROL_SECONDS;

    /* Nothing to do, the power profile is not set to automatic */
    if (!isAutomatic) {
      lastPowerProfileChecked = Date.now();

      printMessage(
        `${messagePrefix} ⚡️ power profile is not automatic, using [${newPowerProfileType}] without changes`
      );
      return {
        newPowerProfileType,
        powerProfileChanged: false,
        lastPowerProfileChecked,
        needProfileRefresh: false,
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

      const fullPower =
        newPowerProfileType === PowerProfileType.AUTOMATIC_FULL || newPowerProfileType === PowerProfileType.FULL;

      printMessage(
        `${messagePrefix} 🆕 ${
          fullPower ? "🔥" : "♻️"
        } power profile changed by user from [${currentPowerProfileType}] to [${newPowerProfileType}]`
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
      let movementAlarm = false;
      if (newPowerProfileType === PowerProfileType.AUTOMATIC_FULL && metersMoveInLastSeconds < movementsMts.balanced) {
        newPowerProfileType = PowerProfileType.AUTOMATIC_BALANCED;
        powerProfileChanged = true;
      } else if (
        /** Change to minimal power profile */
        newPowerProfileType === PowerProfileType.AUTOMATIC_BALANCED &&
        metersMoveInLastSeconds < movementsMts.minimal
      ) {
        newPowerProfileType = PowerProfileType.AUTOMATIC_MINIMAL;
        powerProfileChanged = true;
      } else if (
        /** Change to balanced power profile */
        newPowerProfileType === PowerProfileType.AUTOMATIC_MINIMAL &&
        metersMoveInLastSeconds > movementsMts.minimal
      ) {
        movementAlarm = true;
        newPowerProfileType = PowerProfileType.AUTOMATIC_BALANCED;
        powerProfileChanged = true;
      } else if (
        /** Change to full power profile */
        newPowerProfileType === PowerProfileType.AUTOMATIC_BALANCED &&
        metersMoveInLastSeconds > movementsMts.balanced
      ) {
        movementAlarm = true;
        newPowerProfileType = PowerProfileType.AUTOMATIC_FULL;
        powerProfileChanged = true;
      }

      if (movementAlarm) printMessage(`${messagePrefix} 🚶‍♂️ [MOVE] 🏃 Change power profile for movement`);
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
      message = `power profile for device [${newPowerProfileType}] is not changed`;
    }
    printMessage(`${messagePrefix} ⚡️ ${message}`);

    /* Remember that the power profile should be refreshed */
    needProfileRefresh = !powerProfileChanged && lastPowerProfileCheckedDiff;
    if (needProfileRefresh) {
      lastPowerProfileChecked = Date.now();

      printMessage(
        `${messagePrefix} 🔄 power profile refresh needed, last check was [${lastPowerProfileCheckedDiffSec} sec] ago`
      );
    }

    if (!powerProfileChanged && !needProfileRefresh) {
      printMessage(
        `${messagePrefix} ⚡️ next power profile change in ${
          MOVEMENTS_CONTROL_SECONDS - lastPowerProfileCheckedDiffSec
        } seconds`
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
  };
}

export default getPowerProfile;
