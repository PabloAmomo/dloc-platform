import { configApp } from 'config/configApp';
import { logError } from 'functions/logError';
import { ReactNode, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from './UserProvider';
import { WebsockeOnCommands, emptyWebsocketOnCommands } from 'models/WebsockeOnCommands';
import { WebsockeOnEvents, emptyWebsocketOnEvents } from 'models/WebsockeOnEvents';
import { WebSocketData } from 'models/WebSocketData';
import { WebSocketDataCommands } from 'enums/WebSocketDataCommands';
import { WebSocketEvents } from 'enums/WebSocketEvents';
import { WebsocketProviderInterface, WebsocketProviderValueType } from 'models/WebsocketProviderInterface';
import { WebSocketServiceData, WebSocketServiceDataError } from 'models/WebSocketServiceResponse';
import showAlert from 'functions/showAlert';

export const WebsocketProvider = (props: WebsocketProviderProps) => {
  const { children, url, timeout = 60000 }: WebsocketProviderProps = props;
  const [isReady, setIsReady] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);
  const [value, setValue] = useState<WebsocketProviderValueType>({ time: 0, data: undefined });
  const { isLoggedIn, user, logout } = useUserContext();
  const { t } = useTranslation();
  const onCommands = useRef<WebsockeOnCommands>(emptyWebsocketOnCommands);
  const onEvents = useRef<WebsockeOnEvents>(emptyWebsocketOnEvents);
  const webSocket = useRef<WebSocket>();
  const lastConnError = useRef<number>(0);
  const timer = useRef<number>(0);

  /** Send data to the websocket */
  const send = (data: any) => webSocket.current?.send(data);

  /** Send a command through the websocket */
  const sendCommand = (command: WebSocketDataCommands, data: any) => send(JSON.stringify({ command, data }));

  /** Clear the callback for the websocket commands */
  const clearOnHandlers = () => {
    onCommands.current = emptyWebsocketOnCommands;
    onEvents.current = emptyWebsocketOnEvents;
  };

  /** Set the callback for the websocket commands (WebsockeOnCommands / emptyWebsocketOnCommands / WebSocketDataCommands) */
  const setOnCommands = (command: WebSocketDataCommands, callback: { (data: WebSocketServiceData): void }) => (onCommands.current[`on${command}`] = callback);

  /** Set the callback for the websocket events */
  const setOnEvents = (command: WebSocketEvents, callback: { (data: any): void }) => (onEvents.current[`${command}`] = callback);

  /** Process the data received from the websocket */
  useEffect(() => {
    if (!value || !value?.data) return;
    try {
      /** Process the data received from the websocket */
      const data: WebSocketData = value?.data;

      /** Check if receive an error */
      const error = data?.data as WebSocketServiceDataError;
      if (error?.error) {
        logError(`Error in command ${data.command}`, error.error);
        return;
      }

      /** Run the command */
      if (WebSocketDataCommands[`${data.command}`]) onCommands.current[`on${data.command}`](data.data);
      else logError(`WebsocketProvider invalid command '${data.command}'`);

      //
    } catch (error: Error | any) {
      logError('WebsocketProvider', error);
    }
  }, [value]);

  /** Connect to the websocket when the user is logged in */
  useEffect(() => {
    if (isLoggedIn && value.time !== 0 && value.time + timeout < Date.now()) disconnect();
    connect();
  }, [isLoggedIn, user, tick]);

  /** Cleanup when the component is unmounted */
  useEffect(() => {
    /** Cleanup */
    return () => {
      if (timer) clearInterval(timer.current);
      disconnect();
    };
  }, []);

  /** Set interval to try to reconnect */
  useEffect(() => {
    if (timer) clearInterval(timer.current);
    if (!isReady) timer.current = setInterval(() => setTick(Date.now()), 2000);
  }, [isReady]);

  /** Action when the connection fails or gets an error */
  const onErrorTryGetPositions = useCallback(() => {
    if ((lastConnError.current ?? 0) + configApp.retrievePositions < Date.now()) {
      lastConnError.current = Date.now();
      setValue({ time: Date.now(), data: { command: WebSocketDataCommands.NewData, data: '' } });
    }
    disconnect();
  }, [setValue, lastConnError]);

  /** Connect to the websocket */
  const connect = () => {
    if (!isLoggedIn) {
      disconnect();
      return;
    }
    const wsState: number = webSocket.current?.readyState ?? -1;
    if (wsState === webSocket.current?.CONNECTING || wsState === webSocket.current?.OPEN) return;

    disconnect();

    try {
      const socket = new WebSocket(`${url}?token=${user.token}&authProvider=${user.authProvider}`);
      socket.addEventListener('error', () => onErrorTryGetPositions());
      socket.addEventListener('close', () => setIsReady(false));
      socket.addEventListener('open', () => setIsReady(true));
      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data?.error === 'unauthorized') {
          showAlert(t('errors.unauthorized'), 'error');
          disconnect();
          logout();
          return;
        }

        setValue({ time: Date.now(), data });
      });
      webSocket.current = socket;
    } catch (error) {
      onErrorTryGetPositions();
    }
  };

  /** Close and release the websocket */
  const disconnect = () => {
    if (isReady) return;

    setIsReady(false);

    if (!webSocket.current) return;
    try {
      if (webSocket.current.readyState !== webSocket.current.CLOSED) webSocket.current?.close();
    } finally {
      webSocket.current = undefined;
      onEvents.current.onClose(null);
    }
  };

  /** Return the provider */
  return <WebsocketContext.Provider value={{ isReady, value, setOnCommands, setOnEvents, clearOnHandlers, sendCommand }}>{children}</WebsocketContext.Provider>;
};

export const useWebsocketContext = () => useContext(WebsocketContext);

const WebsocketContext = createContext<WebsocketProviderInterface>({
  clearOnHandlers: () => logError('WebsocketContext.cleaeOnCommands'),
  isReady: false,
  setOnCommands: () => logError('WebsocketContext.setOnCommands'),
  setOnEvents: () => logError('WebsocketContext.setOnEvents'),
  sendCommand: () => logError('WebsocketContext.sendCommand'),
  value: { time: 0, data: undefined },
});

interface WebsocketProviderProps {
  timeout?: number;
  url: string;
  children: ReactNode;
}
