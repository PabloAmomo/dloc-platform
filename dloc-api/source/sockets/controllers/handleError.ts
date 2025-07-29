import WebSocket from 'ws';
import { printMessage } from '../../functions/printMessage';

const handleError = (props: HandleErrorProps) => {
  const { webSocket, error }: HandleErrorProps = props;
  printMessage(`connection error: [${error.message}]`);
};

export default handleError;

export interface HandleErrorProps {
  webSocket: WebSocket;
  error: WebSocket.ErrorEvent;
}
