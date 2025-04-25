import { DevicePosition } from './DevicePosition';

export interface WebSocketCommandPositionData {
  positions: DevicePosition[];
  interval: number;
}

export interface WebSocketCommandPositionError {
  error: any;
}

export type WebSocketCommandPositionResponse = WebSocketCommandPositionData | WebSocketCommandPositionError;
