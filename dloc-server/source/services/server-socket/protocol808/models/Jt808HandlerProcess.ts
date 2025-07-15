import Jt808HandlerProcessProps from "./Jt808HandlerProcessProps";

type Jt808HandlerProcess = ({
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
}: Jt808HandlerProcessProps) => void;

export default Jt808HandlerProcess;
