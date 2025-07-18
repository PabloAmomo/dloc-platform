import { PowerProfileType } from "../../enums/PowerProfileType";
import convertStringToHexString from "../../functions/convertStringToHexString";
import { getNormalizedIMEI } from "../../functions/getNormalizedIMEI";
import getPowerProfile from "../../functions/getPowerProfile";
import { printMessage } from "../../functions/printMessage";
import processPacketHealth from "../../functions/processPacketHealth";
import { getRemoteAddress } from "../../functions/remoteAddress";
import { CACHE_IMEI, clearItemInCacheIMEI } from "../../infraestucture/caches/cacheIMEI";
import { CacheImei } from "../../infraestucture/models/CacheImei";
import { ServerSocketHandler } from "../../infraestucture/models/ServerSocketHandler";
import ServerSocketHandlerProps from "../../infraestucture/models/ServerSocketHandlerProps";

// TODO: [REFACTOR] Refactor this file to use a more modular approach, separating concerns and improving readability.

// TODO: [FEATURE] Add parameter to specify the powerProfileConfig function to use.
const serverSocketHandler: ServerSocketHandler = ({
  protocol,
  conn,
  persistence,
  handleConnection,
  handleProcess,
  handlePacket,
  handleClose,
  handleEnd,
  handleError,
  getPowerProfileConfig,
  decoder,
}: ServerSocketHandlerProps) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var newConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => handleClose(remoteAddress, imei));
  conn.on("end", () => handleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => handleError(remoteAddress, imei, err));

  // TODO: [REFACTOR] Move this to a separate function
  const disconnect = () => {
    conn.destroy();
    clearItemInCacheIMEI(imei);
    if (!remoteAddress.includes("127.0.0.1"))
      printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Connection closed.`);
  };

  // TODO: [REFACTOR] Move this to a separate function
  const sendData = (data: Buffer[] | String[]) => {
    if (!conn || conn.destroyed) {
      printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Connection is already closed.`);
      return;
    }

    const showError = (err: Error) => {
      printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Error sending data: ${err.message}`);
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
      } else {
        printMessage(`[${getNormalizedIMEI(imei)}] (${remoteAddress}) ❌ Unsupported data type: ${typeof dataItem}.`);
      }
    }
  };

  /** Handle data */
  conn.on("data", (data: Buffer) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataString: string = data.toString();
    let dataShow: string;
    let dataToUse;

    if (protocol === "PROTO1903") dataShow = dataString;
    else if (protocol === "JT808") dataShow = convertStringToHexString(data);
    else {
      printMessage(`[${tempImei}] (${remoteAddress}) ❌ Unsupported protocol: ${protocol}.`);
      disconnect();
      return;
    }

    dataToUse = decoder(data);

    counter++;
    if (counter > 32000) counter = 1;

    try {
      /** Check if health packet */
      if (processPacketHealth(dataString, remoteAddress, tempImei, sendData, disconnect)) return;

      /** New socket connection */
      if (newConnection) printMessage(`[${tempImei}] (${remoteAddress}) 🧑‍💻 new connection.`);

      handleConnection({
        imei,
        remoteAddress,
        data: dataToUse as any,
        handlePacket: handlePacket as any,
        persistence,
        counter,
        disconnect,
      })
        .then(async (results) => {
          if (!results[0]?.imei) {
            printMessage(`[${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataShow}].`);
            disconnect();
            return;
          }
          imei = results[0].imei;
          const prefix = `[${imei}] (${remoteAddress})`;

          /* If disconnected then return */
          if (!conn || conn.destroyed) return;

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
            newPowerProfileType,
            powerProfileChanged,
            lastPowerProfileChecked,
            needProfileRefresh,
            movementsControlSeconds,
          } = await getPowerProfile(
            imei,
            persistence,
            imeiData.lastPowerProfileChecked,
            prefix,
            newConnection,
            imeiData.powerProfile
          );

          /** create or update socket connection to cache */
          CACHE_IMEI.updateOrCreate(imei, {
            powerProfile: newPowerProfileType,
            lastPowerProfileChecked,
          });

          handleProcess({
            results,
            imei,
            prefix,
            counter,
            newConnection,
            powerProfileChanged,
            needProfileRefresh,
            imeiData,
            newPowerProfileType,
            movementsControlSeconds,
            sendData,
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
