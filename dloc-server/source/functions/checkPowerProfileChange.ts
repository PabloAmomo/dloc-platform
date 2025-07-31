import {
  PowerProfileType,
  powerProfileTypeIsBalanced,
  powerProfileTypeIsFull,
  powerProfileTypeIsMinimal,
} from "../enums/PowerProfileType";
import { printMessage } from "./printMessage";

const checkPowerProfileChange = (
  newPowerProfileType: PowerProfileType,
  metersMoveInLastSeconds: number,
  movementsMtsBalanced: number,
  movementsMtsMinimal: number,
  prefix: string
) => {
  let movementAlarm = false;
  const powerIsFull = powerProfileTypeIsFull(newPowerProfileType);
  const powerIsBalanced = powerProfileTypeIsBalanced(newPowerProfileType);
  const powerIsMinimal = powerProfileTypeIsMinimal(newPowerProfileType);

  /**  Change from FULL to BALANCED */
  if (powerIsFull && metersMoveInLastSeconds < movementsMtsBalanced) {
    newPowerProfileType = PowerProfileType.AUTOMATIC_BALANCED;
  } else if (
    /**  Change from BALANCED to MINIMAL */
    powerIsBalanced &&
    metersMoveInLastSeconds < movementsMtsMinimal
  ) {
    newPowerProfileType = PowerProfileType.AUTOMATIC_MINIMAL;
  } else if (
    /**  Change from MINIMAL to BALANCED */
    powerIsMinimal &&
    metersMoveInLastSeconds > movementsMtsMinimal
  ) {
    newPowerProfileType = PowerProfileType.AUTOMATIC_BALANCED;
    movementAlarm = true;
  } else if (
    /**  Change from BALANCED to FULL */
    powerIsBalanced &&
    metersMoveInLastSeconds > movementsMtsBalanced
  ) {
    newPowerProfileType = PowerProfileType.AUTOMATIC_FULL;
    movementAlarm = true;
  }

  if (movementAlarm) printMessage(`${prefix} 🚶‍♂️ [MOVE] 🏃 Change power profile for movement`);

  return newPowerProfileType;
};

export default checkPowerProfileChange;
