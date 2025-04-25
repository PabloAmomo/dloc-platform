import { Persistence } from '../../persistence/_Persistence';
import { printMessage } from '../../functions/printMessage';
import { sendWebSocketDataProps } from '../../functions/sendWebSocketData';
import { UserData } from '../../models/UserData';
import { WebSocketDataCommands } from '../../enums/WebSocketDataCommands';
import { WebSocketServiceResponse } from '../../persistence/models/WebSocketSericeResponse';
import getPositionService from '../services/getPositionService';
import WebSocket from 'ws';

const handleMessage = async (props: HandleMessageProps) => {
  const { webSocket, data, persistence, userData, sendData } = props;

  const commando: WebSocketDataCommands = data.command;
  let returnData: WebSocketServiceResponse = { command: commando, error: 'Unknown command' };

  switch (commando) {
    case WebSocketDataCommands.GetPositions:
      const interval = data?.data?.interval ?? -1;
      returnData =
        interval >= 0 ? await getPositionService({ webSocket, persistence, interval, userData }) : { command: commando, error: 'Interval not provided' };
      break;

    default:
      printMessage(`Unknown command: ${data.command}`);
      break;
  }
  sendData({ webSocket, data: returnData });
};

export default handleMessage;

export interface HandleMessageProps {
  webSocket: WebSocket;
  persistence: Persistence;
  userData: UserData;
  sendData: (props: sendWebSocketDataProps) => void;
  data: {
    command: WebSocketDataCommands;
    data?: any;
  };
}
