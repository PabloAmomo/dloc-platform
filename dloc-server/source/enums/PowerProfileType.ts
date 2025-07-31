export enum PowerProfileType {
  FULL = "full",
  BALANCED = "balanced",
  MINIMAL = "minimal",
  AUTOMATIC_FULL = "automatic_full",
  AUTOMATIC_BALANCED = "automatic_balanced",
  AUTOMATIC_MINIMAL = "automatic_minimal",
}

const powerProfileTypeAutomatic = (powerProfileType: PowerProfileType) =>
  [PowerProfileType.AUTOMATIC_FULL, PowerProfileType.AUTOMATIC_BALANCED, PowerProfileType.AUTOMATIC_MINIMAL].includes(
    powerProfileType
  );

const powerProfileTypeIsFull = (powerProfileType: PowerProfileType) =>
  [PowerProfileType.AUTOMATIC_FULL, PowerProfileType.FULL].includes(
    powerProfileType
  );


const powerProfileTypeIsMinimal = (powerProfileType: PowerProfileType) =>
  [PowerProfileType.MINIMAL, PowerProfileType.AUTOMATIC_MINIMAL].includes(
    powerProfileType
  );

  const powerProfileTypeIsBalanced = (powerProfileType: PowerProfileType) =>
  [PowerProfileType.BALANCED, PowerProfileType.AUTOMATIC_BALANCED].includes(
    powerProfileType
  );

export { powerProfileTypeAutomatic, powerProfileTypeIsFull, powerProfileTypeIsMinimal, powerProfileTypeIsBalanced };