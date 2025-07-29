import { PowerProfileType } from '../../enums/PowerProfileType';
import { WebSocketDataCommands } from '../../enums/WebSocketDataCommands';
import { Device } from '../entities/Device';

export interface WebSocketServiceGetPosition {
  interval: number;
  positions: Device[];
}

export interface WebSocketServiceUpdatePowerProfile {
  result: boolean;
  imei: string;
  powerProfile: PowerProfileType
}

export interface WebSocketServiceResponseResult<WebSocketCommands, T> {
  command: WebSocketCommands;
  data: T;
}

export interface WebSocketServiceResponseError {
  command: WebSocketDataCommands;
  error: any;
}

export type WebSocketServiceResponse =
  | WebSocketServiceResponseResult<WebSocketDataCommands.Hi, {}>
  | WebSocketServiceResponseResult<WebSocketDataCommands.KeepAlive, {}>
  | WebSocketServiceResponseResult<WebSocketDataCommands.NewData, {}>
  | WebSocketServiceResponseResult<WebSocketDataCommands.Positions, WebSocketServiceGetPosition>
  | WebSocketServiceResponseResult<WebSocketDataCommands.UpdatePowerProfile, WebSocketServiceUpdatePowerProfile>
  | WebSocketServiceResponseError;
