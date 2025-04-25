import { HandlePacketProps } from "../models/HandlePacketProps";
import { printMessage } from "./printMessage";

type onErrorType = 'discarted' | 'position' | 'batteryLevel' | 'update' | 'lastActivity' | 'history';

const handlePacketOnError = (props: HandlePacketProps & { name: onErrorType; error: Error }) => {
  const { imei, remoteAdd, data, persistence, name, error } = props;
  printMessage(`[${imei}] (${remoteAdd}) error persisting ${name} [${error?.message || error}]`);
};

export { handlePacketOnError };