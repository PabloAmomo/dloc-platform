import net from "node:net";

import { PowerProfileType } from "../../enums/PowerProfileType";
import convertStringToHexString from "../../functions/convertStringToHexString";
import { getNormalizedIMEI } from "../../functions/getNormalizedIMEI";
import getPowerProfile from "../../functions/getPowerProfile";
import { printMessage } from "../../functions/printMessage";
import processPacketHealth from "../../functions/processPacketHealth";
import { getRemoteAddress } from "../../functions/remoteAddress";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../infraestucture/caches/cacheIMEI";
import { CacheImei } from "../../infraestucture/models/CacheImei";
import { Persistence } from "../../models/Persistence";
import Proto1903HandleProcess from "../../services/server-socket/protocol1903/models/Proto1903HandleProcess";
import Proto1903HandlePacket from "../../services/server-socket/protocol1903/models/Proto1903HandlePacket";
import Jt808HandlePacket from "../../services/server-socket/protocol808/models/Jt808HandlePacket";
import Jt808HandleProcess from "../../services/server-socket/protocol808/models/Jt808HandleProcess";
import HandleConnection from "../../services/server-socket/models/HandleConnection";
import HandleClose from "../../services/server-socket/models/HandleClose";
import HandleError from "../../services/server-socket/models/HandleError";
import HandleEnd from "../../services/server-socket/models/HandleEnd";

// TODO: [REFACTOR] Mover la definiciion de serverSocketHandler a un archivo separado en models

const serverSocketHandler = ({
  protocol,
  conn,
  persistence,
  handleConnection,
  handleProcess,
  handlePacket,
  handleClose,
  handleEnd,
  handleError,
}: {
  protocol: "PROTO1903" | "JT808";
  conn: net.Socket;
  persistence: Persistence;
  handleConnection: HandleConnection;
  handleProcess: Proto1903HandleProcess | Jt808HandleProcess;
  handlePacket: Proto1903HandlePacket | Jt808HandlePacket;
  handleClose: HandleClose;
  handleEnd: HandleEnd;
  handleError: HandleError;
}) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var newConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => handleClose(remoteAddress, imei));
  conn.on("end", () => handleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => handleError(remoteAddress, imei, err));

  const disconnect = () => {
    conn.destroy();
    clearItemInCacheIMEI(imei);
    printMessage(
      `[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Connection closed.`
    );
  };

  const sendData = (data: Buffer[] | String[]) => {
    if (!conn || conn.destroyed) {
      printMessage(
        `[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Connection is already closed.`
      );
      return;
    }

    const showError = (err: Error) => {
      printMessage(
        `[${getNormalizedIMEI(
          imei
        )}] (${remoteAddress}) ❌ Error sending data: ${err.message}`
      );
    };

    for (const dataItem of data) {
      if (typeof dataItem === "string") {
        conn.write(dataItem, (err) => {
          if (err) showError(err);
        });
      } else if (dataItem instanceof Buffer) {
        conn.write(dataItem, (err) => {
          if (err) showError(err);
        });
        conn.write(Buffer.alloc(0)); // Send an empty buffer to indicate end of packet
      }
    }
  };

  /** Handle data */
  conn.on("data", (data: Buffer) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataString: string = data.toString();
    const dataShow: string =
      protocol === "PROTO1903" ? dataString : convertStringToHexString(data);
    const dataToUse = protocol === "PROTO1903" ? dataString : data;

    counter++;
    if (counter > 32000) counter = 1;

    try {
      /** Check if health packet */
      if (processPacketHealth(dataString, remoteAddress, tempImei, sendData, disconnect))
        return;

      /** New socket connection */
      if (newConnection)
        printMessage(`[${tempImei}] (${remoteAddress}) 🧑‍💻 new connection.`);

      handleConnection({
        imei,
        remoteAddress,
        data: dataToUse as any,
        handlePacket: handlePacket as any,
        persistence,
        counter,
        disconnect
      })
        .then(async (results) => {
          if (!results[0]?.imei) {
            printMessage(
              `[${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataShow}].`
            );
            disconnect();
            return;
          }
          imei = results[0].imei;
          const prefix = `[${imei}] (${remoteAddress})`;

          /* If disconnected then return */
          if (!conn || conn.destroyed) return

          printMessage(`${prefix} 🌟 Current serial counter [${counter}].`);

          /** Get the las information about the IMEI */
          const imeiData: CacheImei = CACHE_IMEI.get(imei) ?? {
            powerProfile: PowerProfileType.AUTOMATIC_MINIMAL,
            lastPowerProfileChecked: 0,
            lastLBSRequestTimestamp: 0,
            lastReportRequestTimestamp: 0,
          };

          /** Get power profile for the imei */
          const {
            powerProfile: newPowerProfile,
            lastPowerProfileChecked,
            needProfileRefresh,
            movementsControlSeconds,
          } = await getPowerProfile(
            imei,
            persistence,
            imeiData.lastPowerProfileChecked,
            prefix,
            newConnection
          );

          /** create or update socket connection to cache */
          CACHE_IMEI.updateOrCreate(imei, {
            powerProfile: newPowerProfile,
            lastPowerProfileChecked,
          });

          const powerPrfChanged = imeiData.powerProfile !== newPowerProfile;

          handleProcess({
            results,
            imei,
            prefix,
            counter,
            newConnection,
            powerPrfChanged,
            needProfileRefresh,
            imeiData,
            newPowerProfile,
            movementsControlSeconds,
            sendData
          });
          newConnection = false;

          //
        })
        .catch((err: Error) => {
          throw err;
        });
    } catch (err: Error | any) {
      printMessage(
        `[${tempImei}] (${remoteAddress}) ❌ error handling data (${
          err?.message ?? "unknown error"
        }) data [${dataShow}].`
      );

      disconnect();
    }
  });
};

export default serverSocketHandler;
