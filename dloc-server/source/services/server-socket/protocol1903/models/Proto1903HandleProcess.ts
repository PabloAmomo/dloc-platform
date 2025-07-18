import Proto1903ProcessProps from "./Proto1903ProcessProps";

type Proto1903HandleProcess = ({
  results,
  imei,
  prefix,
  counter,
  isNewConnection,
  powerProfileChanged,
  needProfileRefresh,
  imeiData,
  newPowerProfileType,
  sendData
}: Proto1903ProcessProps) => void;

export default Proto1903HandleProcess;
