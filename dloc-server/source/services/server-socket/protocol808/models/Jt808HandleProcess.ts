import Jt808ProcessProps from "./Jt808ProcessProps";

type Jt808HandleProcess = ({
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
  sendData
}: Jt808ProcessProps) => void;

export default Jt808HandleProcess;
