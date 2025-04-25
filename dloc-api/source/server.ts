import { encriptionAES256 } from './functions/encriptionAES256';
import { EncriptionHelper } from './models/EncriptionHelper';
import { encriptionHelper, setEncriptionHelper } from './functions/encriptionHelper';
import { getPersistence, setPersistence } from './persistence/persistence';
import { mySqlPersistence } from './persistence/mySql/_mySqlPersistence';
import { Persistence } from './persistence/_Persistence';
import { PersistenceResult } from './persistence/models/PersistenceResult';
import { printMessage } from './functions/printMessage';
import { setEncription } from './persistence/encription';
import { startServerHTTP } from './server-http';
import { startServerWebSocket } from './server-webSocket';
import dotenv from 'dotenv';
import fs from 'fs';

/** Load environment variables */
dotenv.config();

/** PORTS */
const PORT_HTTP: any = process.env.PORT_HTTP ?? '0';
const PORT_SOCKET: any = process.env.PORT_WS ?? '0';
const UPLOAD_FOLDER: any = process.env.UPLOAD_FOLDER ?? 'uploads';

/** Persistence */
setPersistence(new mySqlPersistence());
const persistence: Persistence = getPersistence();

/** Encription */
setEncription(encriptionAES256);
setEncriptionHelper(encriptionAES256);
const encription: EncriptionHelper = encriptionHelper;

/** Banner */
printMessage('--------------------------------------------------------------------------------------------------');
if (PORT_HTTP && PORT_HTTP !== '0') printMessage(' DLOC Api Server listening on http port ' + PORT_HTTP);
if (PORT_SOCKET && PORT_SOCKET !== '0') printMessage(' DLOC Api Server listening on web socker port ' + PORT_SOCKET);
printMessage('--------------------------------------------------------------------------------------------------');

/** No service */
if (!PORT_HTTP && !PORT_SOCKET) {
  printMessage('Error: No service defined');
  process.exit(1);
}

/** Check encription */
printMessage(`Encription: [${encription.getAlgoritmName()}]`);

/** Check persistence */
printMessage(`Persistence: [${persistence.getPersistenceName()}]`);
printMessage(`Persistence Config: [${persistence.getPersistenceConfig()}]`);
persistence.health().then((result: PersistenceResult) => {
  if (result.error) {
    printMessage(`Persistence not ready: ${result.error.message}`);
    process.exit(1);
  }
});

/** Check upload folder */
if (!fs.existsSync(UPLOAD_FOLDER)) {
  printMessage('Create folder for device-images: [' + UPLOAD_FOLDER + ']');
  fs.mkdirSync(UPLOAD_FOLDER);
}

/** Start API server */
if (PORT_HTTP && PORT_HTTP !== '0') startServerHTTP(PORT_HTTP);

/** Start Web Socket Server */
if (PORT_SOCKET && PORT_SOCKET !== '0') startServerWebSocket({ persistence, encription, port: Number(PORT_SOCKET) });
