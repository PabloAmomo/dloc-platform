import { ServerSocketHandlerProcessProps } from "./ServerSocketHandlerProcessProps";

export type ServerSocketHandlerProcess = ({
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
  movementsControlSeconds
}: ServerSocketHandlerProcessProps) => void;
