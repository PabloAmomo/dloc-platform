import { handlePacket } from '../../../services/server-socket/model-gf-xx/handlePacket';
import { Persistence } from '../../../models/Persistence';
import { printMessage } from '../../../functions/printMessage';
import { remoteAddress } from '../../../functions/remoteAddress';
import handleClose from '../../../services/server-socket/model-gf-xx/connection/handleClose';
import handleData from '../../../services/server-socket/model-gf-xx/connection/handleData';
import handleEnd from '../../../services/server-socket/model-gf-xx/connection/handleEnd';
import handleError from '../../../services/server-socket/model-gf-xx/connection/handleError';
import net from 'node:net';

const HTTP_200 = `${[
  'HTTP/1.1 200 OK',
  'Content-Type: text/html; charset=UTF-8',
  'Content-Encoding: UTF-8',
  'Accept-Ranges: bytes',
  'Connection: keep-alive',
].join('\n')}\n\n`;

const gfxxHandler = (conn: net.Socket, persistence: Persistence) => {
  const remoteAdd: string = remoteAddress(conn);
  var imei: string = '';
  var lastTime: number = Date.now();
  var newConnection: boolean = true;

  /** Create event listeners for socket connection */
  conn.once('close', () => handleClose(remoteAdd));
  conn.on('end', () => handleEnd(remoteAdd));
  conn.on('error', (err: Error) => handleError(remoteAdd, err));

  /** Handle data */
  conn.on('data', (data: any) => {
    const tempImei: string = imei !== '' ? imei : '---------------';
    try {
      /** Process data */
      const dataString: string = data.toString();

      /** Check if health packet */
      if (dataString.indexOf('HEAD /health') !== -1) {
        if (!remoteAdd.includes('127.0.0.1')) printMessage(`[${tempImei}] (${remoteAdd}) health packet received.`);
        conn.write(HTTP_200);
        conn.destroy();
        return;
      }

      /** New socket connection */
      if (newConnection) printMessage(`[---------------] (${remoteAdd}) new connection.`);

      /** Handle data */
      handleData({ imei, remoteAdd, data: dataString, handlePacket, persistence, conn })
        .then((results) => {
          imei = results[0].imei;

          /** Save response to send */
          let toSend: string = '';
          for (let i = 0; i < results.length; i++) {
            if (results[i].response !== '') toSend += results[i].response;
          }

          /** If new connection send configuration after response */
          if (newConnection) {
            toSend += 'TRVWP020000010020#';
            toSend += 'TRVBP20#';
            newConnection = false;
          }

          /** send TRVBP20# every minute (Force to report Position) */
          if (Date.now() - lastTime > 60000) {
            lastTime = Date.now();
            toSend += 'TRVBP20#';
            printMessage(`[${tempImei}] (${remoteAdd}) send command TRVBP20.`);
          }

          /** Send */
          conn.write(toSend);
        })
        .catch((err: Error) => {
          throw err;
        });
    } catch (err: Error | any) {
      conn.destroy();
      printMessage(`[${tempImei}] (${remoteAdd}) error handling data (${err?.message ?? 'unknown error'}) data [${data}].`);
    }
  });
};

export { gfxxHandler as gfxxHandler };
