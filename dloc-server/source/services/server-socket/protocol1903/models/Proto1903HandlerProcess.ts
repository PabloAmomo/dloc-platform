import Proto1903HandlerProcessProps from "./Proto1903HandlerProcessProps";

type Proto1903HandlerProcess = ({
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
}: Proto1903HandlerProcessProps) => void;

export default Proto1903HandlerProcess;
