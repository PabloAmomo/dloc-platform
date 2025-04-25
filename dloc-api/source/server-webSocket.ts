import { EncriptionHelper } from './models/EncriptionHelper';
import { Persistence } from './persistence/_Persistence';
import { printMessage } from './functions/printMessage';
import { socketHandler } from './sockets/socketHandler';
import handleClose, { HandleCloseProps } from './sockets/controllers/handleClose';
import handleError, { HandleErrorProps } from './sockets/controllers/handleError';
import handleMessage, { HandleMessageProps } from './sockets/controllers/handleMessage';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';

var webSocketServer: WebSocketServer | undefined = undefined;

const startServerWebSocket = (props: ServerWebSocketProps) => {
  const { persistence, encription, port } = props;

  try {
    if (webSocketServer) {
      webSocketServer.removeAllListeners();
      webSocketServer.close();
    }
  } finally {
    webSocketServer = undefined;
  }

  webSocketServer = new WebSocketServer({ port });

  webSocketServer.on('listening', () => printMessage(`Websocket ready... (ws://localhost:${port})`));

  webSocketServer.on('connection', (webSocket: WebSocket, request: http.IncomingMessage) =>
    socketHandler({
      webSocket,
      request,
      persistence,
      encription,
      events: {
        onConnectionClose: (props: HandleCloseProps) => handleClose(props),
        onConnectionError: (props: HandleErrorProps) => handleError(props),
        onConnectionMessage: (props: HandleMessageProps) => handleMessage(props),
      },
    })
  );

  webSocketServer.on('error', (err) => {
    printMessage(`Error: Websocket server error: ${err}`);
    startServerWebSocket(props);
  });

  return webSocketServer;
};

export { startServerWebSocket };

interface ServerWebSocketProps {
  persistence: Persistence;
  encription: EncriptionHelper;
  port: number;
}
