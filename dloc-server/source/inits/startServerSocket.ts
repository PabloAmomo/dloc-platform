import { printMessage } from '../functions/printMessage';
import net from 'node:net';

var serverSocket: net.Server | undefined;

/** Start Socket server */
const startServerSocket = (handler: (conn: net.Socket) => void, port: number) => {
  if (!port || port === 0) return printMessage('socket server DISABLED...');

  /** Close server */
  if (serverSocket) {
    serverSocket.close();
    serverSocket.unref();
  }

  /** Create server */
  serverSocket = net.createServer();

  /** Handle server events */
  serverSocket.on('connection', handler);
  serverSocket.on('error', (err) => {
    printMessage(`error on server [${err.message}] - restarting...`);
    try {
      serverSocket && serverSocket.close();
    } finally {
      serverSocket && serverSocket.unref();
      startServerSocket(handler, port);
    }
  });

  /** Start Server */
  try {
    serverSocket.listen(port, () => printMessage('socket ready...'));
  } catch (error:any) {
    printMessage(`error on socket server [${error?.message}] - restarting...`);
    try {
      serverSocket.close();
    } finally {
      serverSocket.unref();
      startServerSocket(handler, port);
    }
  }
};

export { startServerSocket };