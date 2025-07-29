import { WebSocketDataCommands } from "enums/WebSocketDataCommands";
  
export interface WebSocketData {
  command: WebSocketDataCommands;
  data: any;
}
