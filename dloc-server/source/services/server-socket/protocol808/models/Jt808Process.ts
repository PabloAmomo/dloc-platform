import Jt808ProcessProps from "./Jt808ProcessProps";

type Jt808Process = ({
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
}: Jt808ProcessProps) => void;

export default Jt808Process;
