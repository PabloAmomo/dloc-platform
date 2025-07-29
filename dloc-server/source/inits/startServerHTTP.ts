import { printMessage } from '../functions/printMessage';
import cors from 'cors';
import express, { Express } from 'express';
import http from 'http';

var serverHttp: http.Server | undefined;

/** Express */
const router: Express = express();
router.use(cors({ origin: '*' }));

/** Start server */
const startServerHTTP = (routes: (router: Express) => void, port: number) => {
  if (!port || port === 0) return printMessage('HTTP server DISABLED...');

  if (serverHttp) {
    serverHttp.close();
    serverHttp.unref();
  }

  serverHttp = http.createServer(router);

  /** Start server */
  try {
    routes(router);
    serverHttp.listen(port, () => printMessage(`http ready... (Health check: http://host:${port}/health)`));
  } catch (error: any) {
    printMessage(`error on http server [${error?.message}] - restarting...`);
    try {
      serverHttp.close();
    } finally {
      serverHttp.unref();
      startServerHTTP(routes, port);
    }
  }
};

export { startServerHTTP };
