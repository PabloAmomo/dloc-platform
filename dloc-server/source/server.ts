import dotenv from "dotenv";
import routes from "./controllers/server-http/routes";
import { protocol1903Handler } from "./controllers/server-socket/protocol-proto1903/proto1903Handler";
import { protocol808Handler } from "./controllers/server-socket/protocol-jt808/jt808Handler";
import { printMessage } from "./functions/printMessage";
import { initCacheIMEI } from "./infraestucture/caches/cacheIMEI";
import { initCacheLBS } from "./infraestucture/caches/cacheLBS";
import { initCachePosition } from "./infraestucture/caches/cachePosition";
import { mySqlPersistence } from "./infraestucture/mySql/mySqlPersistence";
import { startPersistence } from "./inits/startPersistence";
import { startServerHTTP } from "./inits/startServerHTTP";
import { startServerSocket } from "./inits/startServerSocket";
import { getPersistence } from "./persistence/persistence";

/** Load environment variables */
dotenv.config();

/** PORTS */
const PORT_SOCKET: any = process.env.PORT_SOCKET ?? "0";
const PORT_HTTP: any = process.env.PORT_HTTP ?? "0";
const SOCKET_PROTOCOL: any = process.env.SOCKET_PROTOCOL ?? "1903";

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

/** No LBS */
printMessage(
  `🧭 Google GeoPosition: ${
    ENABLE_LBS
      ? "✅ enabled (Watch the Google GeoPosition API quota)"
      : "🚫 disabled"
  }`
);

/** Start LBS Cache */
if (ENABLE_LBS) initCacheLBS();

/** Start IMEI Database Cache */
initCacheIMEI();

/** Start position Cache */
initCachePosition();

/** Start Persistence */
startPersistence(new mySqlPersistence());

/** Start Socket server (Protocol 1903) */
if (SOCKET_PROTOCOL == "1903") {
  printMessage(`✅ Using protocol ${SOCKET_PROTOCOL}.`);
  startServerSocket(
    (conn) => protocol1903Handler(conn, getPersistence()),
    PORT_SOCKET
  );
} else if (SOCKET_PROTOCOL == "808") {
  /** Start Socket server (Protocol 808) */
  printMessage(`✅ Using protocol ${SOCKET_PROTOCOL}.`);
  startServerSocket(
    (conn) => protocol808Handler(conn, getPersistence()),
    PORT_SOCKET
  );
} else {
  printMessage("❌ Error: Invalid SOCKET_PROTOCOL. Use '1903' or '808'.");
  process.exit(1);
}

/** Start HTTP server */
startServerHTTP(routes, PORT_HTTP);
