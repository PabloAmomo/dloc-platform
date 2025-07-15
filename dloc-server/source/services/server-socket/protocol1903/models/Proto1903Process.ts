import Proto1903ProcessProps from "./Proto1903ProcessProps";

type Proto1903Process = ({
  conn,
  results,
  imei,
  prefix,
  counter,
  newConnection,
  powerPrfChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfile,
  movementsControlSeconds,
}: Proto1903ProcessProps) => void;

export default Proto1903Process;
