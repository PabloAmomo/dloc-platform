import { WebSocketServiceDataGetPositions, WebSocketServiceDataHi, WebSocketServiceDataKeepAlive } from './WebSocketServiceResponse';
import { WebSocketServiceDataNewData, WebSocketServiceDataPosition } from './WebSocketServiceResponse';

export interface WebsockeOnCommands {
  onHi: (data: WebSocketServiceDataHi) => void;
  onKeepAlive: (data: WebSocketServiceDataKeepAlive) => void;
  onNewData: (data: WebSocketServiceDataNewData) => void;
  onPositions: (data: WebSocketServiceDataPosition) => void;
  onGetPositions: (data: WebSocketServiceDataGetPositions) => void;
}

export const emptyWebsocketOnCommands: WebsockeOnCommands = {
  onKeepAlive: () => null,
  onNewData: () => null,
  onHi: () => null,
  onPositions: () => null,
  onGetPositions: () => null,
};
