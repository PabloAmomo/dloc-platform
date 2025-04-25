import { WebSocketDataCommands } from '../../enums/WebSocketDataCommands';
import { Device } from '../entities/Device';

export interface WebSocketServiceGetPosition {
  interval: number;
  positions: Device[];
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
  | WebSocketServiceResponseError;
