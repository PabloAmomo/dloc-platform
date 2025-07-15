import { Persistence } from "../models/Persistence";
import { printMessage } from "./printMessage";

type onErrorType = 'discarted' | 'position' | 'batteryLevel' | 'update' | 'lastActivity' | 'history';

const handlePacketOnError = ({
  imei,
  remoteAddress,
  name,
  error
}: {
  imei: string,
  remoteAddress: string,
  name: onErrorType,
  error: Error
}) => {
  const remoteAdd = remoteAddress;
  printMessage(`[${imei}] (${remoteAdd}) error persisting ${name} [${error?.message || error}]`);
};

export { handlePacketOnError };
