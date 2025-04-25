import { printMessage } from './functions/printMessage';
import { ResponseCode } from './enums/ResponseCode';
import cors from 'cors';
import express, { Express } from 'express';
import http from 'http';
import routes from './controllers/routes';

var router: Express = express();

const startServerHTTP = (port: number): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> => {
  /** Enable CORS */
  router.use(cors({ origin: '*' }));

  /** Parse the request and Takes care of JSON data */
  router.use(express.urlencoded({ extended: false }));
  router.use(express.json());

  /** Routes - Add all Domains when needed */
  routes(router);

  /** Error handling */
  router.use((req, res) => {
    const error = new Error('not found');
    return res.status(ResponseCode.NOT_FOUND).json({ message: error.message });
  });

  const server = http.createServer(router);

  server.listen(port, () => printMessage(`HTTP ready... (Health check: http://localhost:${port}/health)`));

  /** Create HTTP Server */
  return server;
};

export { startServerHTTP as startServerHTTP };
