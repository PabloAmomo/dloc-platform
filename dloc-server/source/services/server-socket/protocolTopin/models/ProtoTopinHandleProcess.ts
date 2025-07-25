import ProtovProcessProps from "./ProtoTopinProcessProps";

type ProtoTopinHandleProcess = ({
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

export default ProtoTopinHandleProcess;
