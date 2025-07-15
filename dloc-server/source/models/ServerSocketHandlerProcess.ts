import ServerSocketHandlerProcessProps from "./ServerSocketHandlerProcessProps";

type ServerSocketHandlerProcess = ({
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
}: ServerSocketHandlerProcessProps) => void;

export default ServerSocketHandlerProcess;
