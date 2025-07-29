import { AuthProviders, getProviderFromString } from '../enums/AuthProviders';
import { checkToken } from '../functions/checkToken';
import { EncriptionHelper } from '../models/EncriptionHelper';
import { HandleCloseProps } from './controllers/handleClose';
import { HandleErrorProps } from './controllers/handleError';
import { HandleMessageProps } from './controllers/handleMessage';
import { Persistence } from '../persistence/_Persistence';
import { printMessage } from '../functions/printMessage';
import { sendWebSocketData, sendWebSocketDataProps } from '../functions/sendWebSocketData';
import { UserData } from '../models/UserData';
import { WebSocketDataCommands } from '../enums/WebSocketDataCommands';
import http from 'http';
import WebSocket from 'ws';

const KEEP_ALIVE_INTERVAL: number = 30000;
const NEW_DATA_INTERVAL: number = 5000;

const socketHandler = async (props: socketHandlerProps) => {
  const { webSocket, request, persistence, events, encription }: socketHandlerProps = props;
  const remoteAddress: string = request.socket.remoteAddress ?? '';

  let dataSign: string = '';
  let lastTime: number = Date.now();

  /** Health check */
  if (request.url === '/health') {
    webSocket.close();
    webSocket.removeAllListeners();
    webSocket.terminate();
    return;
  }

  /** New socket connection */
  const urlParams: URLSearchParams = new URL(request?.url ?? '', `http://${request.headers.host}`)?.searchParams ?? [];
  const token: string = urlParams.get('token') ?? '';
  const authProvider: AuthProviders = getProviderFromString(urlParams.get('authProvider'));

  /** validate user */
  const userData: UserData = await checkToken({ token, authProvider, persistence, encription });
  if (!userData.userId) {
    printMessage(`Invalid token: [${authProvider}] from ${remoteAddress} -> [${token.length > 20 ? token.substring(0, 20) + '...' : token}...]`);
    webSocket.send(JSON.stringify({ error: 'unauthorized' }));
    webSocket.close();
    webSocket.terminate();
    return;
  }

  /** New conecion advice */
  printMessage(`[CONNECTION]: ${userData.userId} (${userData.email}) connected from ${remoteAddress}.`);

  /** Send data to socket */
  const sendData = (props: sendWebSocketDataProps) => {
    if (sendWebSocketData(props)) lastTime = Date.now();
  };

  /** Send hello */
  sendData({ webSocket, data: { command: WebSocketDataCommands.Hi, data: {} } });

  /** Keepalive every [KEEP_ALIVE_INTERVAL] seconds */
  const keepAliveInterval: NodeJS.Timeout = setInterval(() => {
    if (lastTime + KEEP_ALIVE_INTERVAL < Date.now()) sendData({ webSocket, data: { command: WebSocketDataCommands.KeepAlive, data: {} } });
  }, 2500);

  /** Check new Data */
  const newDataInterval: NodeJS.Timeout = setInterval(async () => {
    const newSign = await persistence.getDevicesDataSign(userData.userId);

    if (newSign !== dataSign) sendData({ webSocket, data: { command: WebSocketDataCommands.NewData, data: {} } });

    dataSign = newSign;
  }, NEW_DATA_INTERVAL);

  /** Handle events (Close) */
  webSocket.on('close', () => {
    clearInterval(keepAliveInterval);
    clearInterval(newDataInterval);
    printMessage(`[CONNECTION]: ${userData.userId} (${userData.email}) from ${remoteAddress} closed.`);
    events.onConnectionClose({ webSocket });
  });

  /** Handle events (Error) */
  webSocket.on('error', (error: WebSocket.ErrorEvent) => {
    clearInterval(keepAliveInterval);
    clearInterval(newDataInterval);
    printMessage(`[CONNECTION]: ${userData.userId} (${userData.email}) from ${remoteAddress} error ${error}.`);
    events.onConnectionError({ webSocket, error });
  });

  /** Handle events (Message) */
  webSocket.on('message', (data: string) => {
    const parsedData: any = JSON.parse(data);
    events.onConnectionMessage({ webSocket, data: parsedData, persistence, userData, sendData });
  });
};

export { socketHandler };

interface socketHandlerProps {
  webSocket: WebSocket;
  request: http.IncomingMessage;
  persistence: Persistence;
  encription: EncriptionHelper;
  events: {
    onConnectionClose: (props: HandleCloseProps) => void;
    onConnectionError: (props: HandleErrorProps) => void;
    onConnectionMessage: (props: HandleMessageProps) => void;
  };
}
