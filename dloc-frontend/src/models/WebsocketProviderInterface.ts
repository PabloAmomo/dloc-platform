import { WebSocketDataCommands } from "enums/WebSocketDataCommands";
import { WebSocketEvents } from "enums/WebSocketEvents";

export interface WebsocketProviderInterface {
  clearOnHandlers: () => void;
  isReady: boolean | undefined;
  setOnCommands: (command: WebSocketDataCommands, callback: { (data: any): void }) => void;
  setOnEvents: (command: WebSocketEvents, callback: { (data: any): void }) => void;
  value: WebsocketProviderValueType;
  sendCommand: (command: WebSocketDataCommands, data: any) => void;
}

export type  WebsocketProviderValueType = { time: number; data: any | undefined };
