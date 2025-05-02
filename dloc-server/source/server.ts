import { getPersistence } from "./persistence/persistence";
import { gfxxHandler } from "./controllers/server-socket/model-gf-xx/gfxxHandler";
import { mySqlPersistence } from "./infraestucture/mySql/mySqlPersistence";
import { printMessage } from "./functions/printMessage";
import { startPersistence } from "./inits/startPersistence";
import { startServerHTTP } from "./inits/startServerHTTP";
import { startServerSocket } from "./inits/startServerSocket";
import dotenv from "dotenv";
import routes from "./controllers/server-http/routes";
import { Cache } from "./infraestucture/cache/cache";

/** Load environment variables */
dotenv.config();

/** PORTS */
const PORT_SOCKET: any = process.env.PORT_SOCKET ?? "0";
const PORT_HTTP: any = process.env.PORT_HTTP ?? "0";
export const ENABLE_LBS: boolean =
  process.env.ENABLE_LBS === "true" ? true : false;

/** Banner */
printMessage(
  "--------------------------------------------------------------------------"
);
if (PORT_SOCKET && PORT_SOCKET !== "0")
  printMessage(" GPS Server listening on socket port " + PORT_SOCKET);
if (PORT_HTTP && PORT_HTTP !== "0")
  printMessage(" GPS Server listening on http port " + PORT_HTTP);
printMessage(
  "--------------------------------------------------------------------------"
);

/** No service */
if (!PORT_HTTP && !PORT_SOCKET) {
  printMessage("Error: No service defined");
  process.exit(1);
}

/** LBS Status */
printMessage(
  `Google Geolocation: ${
    process.env.ENABLE_LBS === "true"
      ? "enabled (Watch the Google Geolocation API quota)"
      : "disabled"
  }`
);

/** Start LBS Cache */
export const LBS_CACHE = new Cache<string>(3600); // 1 hour in seconds

/** Start Persistence */
startPersistence(new mySqlPersistence());

/** Start Socket server */
startServerSocket((conn) => gfxxHandler(conn, getPersistence()), PORT_SOCKET);

/** Start HTTP server */
startServerHTTP(routes, PORT_HTTP);
