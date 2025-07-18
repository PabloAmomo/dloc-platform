import Jt808ProcessProps from "./Jt808ProcessProps";

type Jt808HandleProcess = ({
  results,
  imei,
  prefix,
  counter,
  isNewConnection,
  powerProfileChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfileType,
  movementsControlSeconds,
  sendData
}: Jt808ProcessProps) => void;

export default Jt808HandleProcess;
