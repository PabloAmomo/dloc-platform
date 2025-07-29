import { WebSocketServiceDataGetPositions, WebSocketServiceDataHi, WebSocketServiceDataKeepAlive, WebSocketServiceDataUpdatePowerProfile } from './WebSocketServiceResponse';
import { WebSocketServiceDataNewData, WebSocketServiceDataPosition } from './WebSocketServiceResponse';

export interface WebsockeOnCommands {
  onHi: (data: WebSocketServiceDataHi) => void;
  onKeepAlive: (data: WebSocketServiceDataKeepAlive) => void;
  onNewData: (data: WebSocketServiceDataNewData) => void;
  onPositions: (data: WebSocketServiceDataPosition) => void;
  onGetPositions: (data: WebSocketServiceDataGetPositions) => void;
  onUpdatePowerProfile: (data: WebSocketServiceDataUpdatePowerProfile) => void;
}

export const emptyWebsocketOnCommands: WebsockeOnCommands = {
  onKeepAlive: () => null,
  onNewData: () => null,
  onHi: () => null,
  onPositions: () => null,
  onGetPositions: () => null,
  onUpdatePowerProfile: () => null,
};
