import dotenv from 'dotenv';
import routes from './controllers/server-http/routes';
import serverSocketHandler from './controllers/server-socket/serverSocketHandler';
import { printMessage } from './functions/printMessage';
import { initCacheIMEI } from './infraestucture/caches/cacheIMEI';
import { initCacheLBS } from './infraestucture/caches/cacheLBS';
import { initCachePosition } from './infraestucture/caches/cachePosition';
import { mySqlPersistence } from './infraestucture/mySql/mySqlPersistence';
import { startPersistence } from './inits/startPersistence';
import { startServerHTTP } from './inits/startServerHTTP';
import { startServerSocket } from './inits/startServerSocket';
import { getPersistence } from './persistence/persistence';
import handleConnection from './services/server-socket/functions/handleConnection';
import proto1903HandleClose from './services/server-socket/protocol1903/connection/proto1903HandleClose';
import proto1903HandleEnd from './services/server-socket/protocol1903/connection/proto1903HandleEnd';
import proto1903HandleError from './services/server-socket/protocol1903/connection/proto1903HandleError';
import proto1903HandlePacket from './services/server-socket/protocol1903/connection/proto1903HandlePacket';
import proto1903HandleProcess from './services/server-socket/protocol1903/connection/proto1903HandleProcess';
import proto1903Decoder from './services/server-socket/protocol1903/functions/proto1903Decoder';
import jt808HandleClose from './services/server-socket/protocol808/connection/jt808HandleClose';
import jt808HandleEnd from './services/server-socket/protocol808/connection/jt808HandleEnd';
import jt808HandleError from './services/server-socket/protocol808/connection/jt808HandleError';
import jt808HandlePacket from './services/server-socket/protocol808/connection/jt808HandlePacket';
import jt808HandleProcess from './services/server-socket/protocol808/connection/jt808HandleProcess';
import jt808Decoder from './services/server-socket/protocol808/functions/jt808Decoder';
import jt808GetPowerProfileConfig from './services/server-socket/protocol808/functions/jt808GetPowerProfileConfig';
import proto1903GetPowerProfileConfig from './services/server-socket/protocol1903/functions/proto1903GetPowerProfileConfig';
import protoGt06HandleProcess from './services/server-socket/protocolGT06/connection/protoGt06HandleProcess';
import protoGt06HandlePacket from './services/server-socket/protocolGT06/connection/protoGt06HandlePacket';
import protoGt06HandleEnd from './services/server-socket/protocolGT06/connection/protoGt06HandleEnd';
import protoGt06HandleError from './services/server-socket/protocolGT06/connection/protoGt06HandleError';
import protoGt06Decoder from './services/server-socket/protocolGT06/functions/protoGt06Decoder';
import protoGt06GetPowerProfileConfig from './services/server-socket/protocolGT06/functions/protoGt06GetPowerProfileConfig';
import protoGt06HandleClose from './services/server-socket/protocolGT06/connection/protoGt06HandleClose';

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
  printMessage("🧭 GPS Server listening on socket port " + PORT_SOCKET);
if (PORT_HTTP && PORT_HTTP !== "0")
  printMessage("🧭 GPS Server listening on http port " + PORT_HTTP);
printMessage(
  "--------------------------------------------------------------------------"
);

/** No service */
if (!PORT_HTTP && !PORT_SOCKET) {
  printMessage("❌ Error: No service defined");
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
    (conn) =>
      serverSocketHandler({
        conn,
        persistence: getPersistence(),
        protocol: "PROTO1903",
        handleConnection,
        handleProcess: proto1903HandleProcess,
        handlePacket: proto1903HandlePacket,
        handleClose: proto1903HandleClose,
        handleEnd: proto1903HandleEnd,
        handleError: proto1903HandleError,
        decoder: proto1903Decoder as (data: Buffer) => string[],
        getPowerProfileConfig: proto1903GetPowerProfileConfig
      }),
    PORT_SOCKET
  );
} else if (SOCKET_PROTOCOL == "808") {
  //
  /** Start Socket server (Protocol 808) */
  printMessage(`✅ Using protocol ${SOCKET_PROTOCOL}.`);
  startServerSocket(
    (conn) =>
      serverSocketHandler({
        conn,
        persistence: getPersistence(),
        protocol: "JT808",
        handleConnection,
        handleProcess: jt808HandleProcess,
        handlePacket: jt808HandlePacket,
        handleClose: jt808HandleClose,
        handleEnd: jt808HandleEnd,
        handleError: jt808HandleError,
        decoder: jt808Decoder as (data: Buffer) => Buffer[],
        getPowerProfileConfig: jt808GetPowerProfileConfig
      }),
    PORT_SOCKET
  );
  //
} else if (SOCKET_PROTOCOL == "GT06") {
  //
  /** Start Socket server (Protocol GT06) */
  printMessage(`✅ Using protocol ${SOCKET_PROTOCOL}.`);
  startServerSocket(
    (conn) =>
      serverSocketHandler({
        conn,
        persistence: getPersistence(),
        protocol: "GT06",
        handleConnection,
        handleProcess: protoGt06HandleProcess,
        handlePacket: protoGt06HandlePacket,
        handleClose: protoGt06HandleClose,
        handleEnd: protoGt06HandleEnd,
        handleError: protoGt06HandleError,
        decoder: protoGt06Decoder as (data: Buffer) => string[],
        getPowerProfileConfig: protoGt06GetPowerProfileConfig
      }),
    PORT_SOCKET
  );
  //
} else {
  printMessage("❌ Error: Invalid SOCKET_PROTOCOL. Use '1903' or '808' or 'GT06'.");
  process.exit(1);
}

/** Start HTTP server */
startServerHTTP(routes, PORT_HTTP);
