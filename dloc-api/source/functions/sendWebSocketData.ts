import WebSocket from 'ws';
import { WebSocketServiceResponse } from '../persistence/models/WebSocketSericeResponse';

const sendWebSocketData = (props :sendWebSocketDataProps): boolean => {
  const { webSocket, data }: sendWebSocketDataProps = props;
  
  if (!webSocket && webSocket?.readyState !== WebSocket.OPEN) return false;

  webSocket.send(JSON.stringify(data));
  return true;
};

export { sendWebSocketData };

export interface sendWebSocketDataProps {
  webSocket: any | WebSocket;
  data: WebSocketServiceResponse;
}
