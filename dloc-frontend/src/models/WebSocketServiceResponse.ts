import { PowerProfileType } from 'enums/PowerProfileType';
import { Device } from './Device';

export interface WebSocketServiceDataError {
  error?: any;
}

export interface WebSocketServiceDataGetPositions extends WebSocketServiceDataError {}
export interface WebSocketServiceDataHi extends WebSocketServiceDataError {}
export interface WebSocketServiceDataKeepAlive extends WebSocketServiceDataError {}
export interface WebSocketServiceDataNewData extends WebSocketServiceDataError {}
export interface WebSocketServiceDataPosition extends WebSocketServiceDataError {
  interval: number;
  positions: Device[];
}
export interface WebSocketServiceDataUpdatePowerProfile extends WebSocketServiceDataError {
  result: boolean;
  imei: string;
  powerProfile: PowerProfileType;
}

export type WebSocketServiceData =
  | WebSocketServiceDataHi
  | WebSocketServiceDataKeepAlive
  | WebSocketServiceDataNewData
  | WebSocketServiceDataPosition
  | WebSocketServiceDataGetPositions
  | WebSocketServiceDataUpdatePowerProfile;
