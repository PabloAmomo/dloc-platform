import dotenv from "dotenv";

import routes from "./controllers/server-http/routes";
import serverSocketHandler from "./controllers/server-socket/serverSocketHandler";
import { printMessage } from "./functions/printMessage";
import { initCacheIMEI } from "./infraestucture/caches/cacheIMEI";
import { initCacheLBS } from "./infraestucture/caches/cacheLBS";
import { initCachePosition } from "./infraestucture/caches/cachePosition";
import { mySqlPersistence } from "./infraestucture/mySql/mySqlPersistence";
import { startPersistence } from "./inits/startPersistence";
import { startServerHTTP } from "./inits/startServerHTTP";
import { startServerSocket } from "./inits/startServerSocket";
import { getPersistence } from "./persistence/persistence";
import handleConnection from "./services/server-socket/functions/handleConnection";
import jt808Injection from "./services/server-socket/protocol808/jt808Injection";
import ServerSocketHandlerPropsInjection from "./infraestucture/models/ServerSocketHandlerPropsInjection";
import proto1903Injection from "./services/server-socket/protocol1903/proto1903Injection";
import protoTopinInjection from "./services/server-socket/protocolTopin/protoTopinInjection";

/** Load environment variables */
dotenv.config();

/** PORTS */
const PORT_SOCKET: any = process.env.PORT_SOCKET ?? "0";
const PORT_HTTP: any = process.env.PORT_HTTP ?? "0";
const SOCKET_PROTOCOL: any = process.env.SOCKET_PROTOCOL ?? "1903";

export const ENABLE_LBS: boolean = process.env.ENABLE_LBS === "true" ? true : false;

/** Banner */
printMessage("--------------------------------------------------------------------------");
if (PORT_SOCKET && PORT_SOCKET !== "0") printMessage("🧭 GPS Server listening on socket port " + PORT_SOCKET);
if (PORT_HTTP && PORT_HTTP !== "0") printMessage("🧭 GPS Server listening on http port " + PORT_HTTP);
printMessage("--------------------------------------------------------------------------");

/** No service */
if (!PORT_HTTP && !PORT_SOCKET) {
  printMessage("❌ Error: No service defined");
  process.exit(1);
}

/** No LBS */
printMessage(
  `🧭 Google GeoPosition: ${ENABLE_LBS ? "✅ enabled (Watch the Google GeoPosition API quota)" : "🚫 disabled"}`
);

/** Start LBS Cache */
if (ENABLE_LBS) initCacheLBS();

/** Start IMEI Database Cache */
initCacheIMEI();

/** Start position Cache */
initCachePosition();

/** Start Persistence */
startPersistence(new mySqlPersistence());

/** Start Socket server */
let injections: ServerSocketHandlerPropsInjection | null = null;

if (SOCKET_PROTOCOL == "1903") injections = proto1903Injection();
else if (SOCKET_PROTOCOL == "808") injections = jt808Injection();
else if (SOCKET_PROTOCOL == "TOPIN") injections = protoTopinInjection();

if (!injections) {
  printMessage(`❌ Error: No injections defined for the selected protocol. ${SOCKET_PROTOCOL}`);
  process.exit(1);
}

printMessage(`✅ Using protocol ${SOCKET_PROTOCOL}.`);
startServerSocket(
  (conn) =>
    serverSocketHandler({
      conn,
      persistence: getPersistence(),
      handleConnection,
      ...injections as ServerSocketHandlerPropsInjection,
    }),
  PORT_SOCKET
);

/** Start HTTP server (Health Check) */
startServerHTTP(routes, PORT_HTTP);
