import config from "../config/config";
import {
  PowerProfileType,
  powerProfileTypeAutomatic,
  powerProfileTypeIsFull,
  powerProfileTypeIsMinimal,
} from "../enums/PowerProfileType";
import GetPowerProfileConfig from "../models/GetProwerProfileConfig";
import { Persistence } from "../models/Persistence";
import getMovementInLastSeconds from "./getMovementInLastSeconds";
import { printMessage } from "./printMessage";
import updatePowerProfile from "./updatePowerProfile";

const { MOVEMENT_MESURE, MOVEMENTS_CONTROL_SECONDS, REFRESH_POWER_PROFILE_SECONDS } = config;

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
  const movementsMts = {
    full: getPowerProfileConfig(PowerProfileType.AUTOMATIC_FULL).movementMeters,
    balanced: getPowerProfileConfig(PowerProfileType.AUTOMATIC_BALANCED).movementMeters,
    minimal: getPowerProfileConfig(PowerProfileType.AUTOMATIC_MINIMAL).movementMeters,
  };
  let newPowerProfileType = PowerProfileType.AUTOMATIC_FULL;
  let powerProfileChanged = false;
  let needProfileRefresh = false;

  if (lastPowerProfileChecked === 0) lastPowerProfileChecked = Date.now();

  try {
    /** If new connection, update database to Full Power Profile */
    if (isNewConnection) {
      await updatePowerProfile(imei, newPowerProfileType, persistence, messagePrefix);
      printMessage(`${messagePrefix} 🆕 new connection, setting power profile to [${newPowerProfileType}]`);
    }

    /* Get the power profile from the database */
    const powerProfile = await persistence.getPowerProfile(imei);
    if (powerProfile.error) throw powerProfile.error;

    /* Set the power profile */
    if (powerProfile?.results[0]?.powerProfile)
      newPowerProfileType = powerProfile.results[0].powerProfile.toLowerCase() as PowerProfileType;

    /* Nothing to do, the power profile is not set to automatic */
    if (!powerProfileTypeAutomatic(newPowerProfileType)) {
      printMessage(`${messagePrefix} ⚡️ power profile is not automatic, using [${newPowerProfileType}]`);
      lastPowerProfileChecked = Date.now();
      return {
        newPowerProfileType,
        powerProfileChanged,
        lastPowerProfileChecked,
        needProfileRefresh,
      };
    }

    /* Power upgrade to full requested by user (FULL profile in database, minimal or balanced in local cache) */
    if (
      !isNewConnection &&
      currentPowerProfileType !== newPowerProfileType &&
      newPowerProfileType === PowerProfileType.AUTOMATIC_FULL
    ) {
      powerProfileChanged = true;

      printMessage(
        `${messagePrefix} 🆕 ${
          powerProfileTypeIsFull(newPowerProfileType) ? "🔥" : "♻️"
        } power profile changed by user from [${currentPowerProfileType}] to [${newPowerProfileType}]`
      );
    }

    /* Check if the power profile must be changed by timeout (REFRESH_POWER_PROFILE_SECONDS) */
    const lastPowerProfileCheckedDiffSec = (Date.now() - lastPowerProfileChecked) / 1000;
    const lastPowerProfileCheckedDiff = lastPowerProfileCheckedDiffSec >= REFRESH_POWER_PROFILE_SECONDS;

    if (!powerProfileChanged && lastPowerProfileCheckedDiff) {
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
    if (!powerProfileChanged)
      printMessage(`${messagePrefix} ⚡️ power profile for device [${newPowerProfileType}] is not changed`);
    else {
      if (!(await updatePowerProfile(imei, newPowerProfileType, persistence, messagePrefix)))
        newPowerProfileType = currentPowerProfileType;
      else
        printMessage(
          `${messagePrefix} ⚡️ power profile changed from [${currentPowerProfileType}] to [${newPowerProfileType}]`
        );
    }

    /* Check if the power profile should be refreshed */
    needProfileRefresh = !powerProfileChanged && lastPowerProfileCheckedDiff;
    if (needProfileRefresh)
      printMessage(
        `${messagePrefix} 🔄 power profile refresh needed, last check was [${lastPowerProfileCheckedDiffSec} sec] ago`
      );

    /** Update last power profile checked time */
    if (powerProfileChanged || needProfileRefresh) lastPowerProfileChecked = Date.now();

    /** Show message only when the profile can be changed */
    if (!powerProfileChanged && !needProfileRefresh && !powerProfileTypeIsMinimal(newPowerProfileType))
      printMessage(
        `${messagePrefix} ⚡️ next power profile change in ${(
          REFRESH_POWER_PROFILE_SECONDS - lastPowerProfileCheckedDiffSec
        ).toFixed(0)} seconds`
      );

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
