import { GetDevicesResult } from '../../persistence/models/GetDevicesResult';
import { Persistence } from '../../persistence/_Persistence';
import { UserData } from '../../models/UserData';
import { WebSocketDataCommands } from '../../enums/WebSocketDataCommands';
import { WebSocketServiceResponse } from '../../persistence/models/WebSocketSericeResponse';
import WebSocket from 'ws';
import { encriptionHelper } from '../../functions/encriptionHelper';

const getPositionService = async (props: getPositionServiceProps): Promise<WebSocketServiceResponse> => {
  const { persistence, userData, interval }: getPositionServiceProps = props;

  const getDevicesResult : GetDevicesResult = await persistence.getDevices(userData.userId, interval, encriptionHelper);
  
  return getDevicesResult?.error
    ? { command: WebSocketDataCommands.Positions, error: getDevicesResult.error }
    : { command: WebSocketDataCommands.Positions, data: { interval, positions: getDevicesResult?.results ?? [] }};
};

export default getPositionService;

interface getPositionServiceProps {
  webSocket: WebSocket;
  persistence: Persistence;
  userData: UserData;
  interval: number;
}
