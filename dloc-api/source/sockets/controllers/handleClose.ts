import WebSocket from 'ws';
import { printMessage } from '../../functions/printMessage';

const handleClose = (props: HandleCloseProps) => {
  const { webSocket } : HandleCloseProps = props;
  printMessage(`connection closed.`);
};

export default handleClose;

export interface HandleCloseProps {
  webSocket: WebSocket;
}
