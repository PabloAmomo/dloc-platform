import ProtovProcessProps from "./ProtoGt06ProcessProps";

type ProtoGt06HandleProcess = ({
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
}: ProtovProcessProps) => void;

export default ProtoGt06HandleProcess;
