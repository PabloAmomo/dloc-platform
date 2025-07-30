import convertAnyToHexString from "../../functions/convertAnyToHexString";
import { getNormalizedIMEI } from "../../functions/getNormalizedIMEI";
import getPowerProfile from "../../functions/getPowerProfile";
import { printMessage } from "../../functions/printMessage";
import processPacketHealth from "../../functions/processPacketHealth";
import { getRemoteAddress } from "../../functions/remoteAddress";
import { CACHE_IMEI } from "../../infraestucture/caches/cacheIMEI";
import { CacheImei, CacheImeiEmptyItem } from "../../infraestucture/models/CacheImei";
import { ServerSocketHandler } from "../../infraestucture/models/ServerSocketHandler";
import ServerSocketHandlerProps from "../../infraestucture/models/ServerSocketHandlerProps";
import serverSocketDisconnect from "./functions/serverSocketDisconnect";
import serverSocketSendData from "./functions/serverSocketSendData";

const serverSocketHandler: ServerSocketHandler = (props: ServerSocketHandlerProps) => {
  const {
    conn,
    persistence,
    handleConnection,
    protocol,
    handlePacket,
    handleProcess,
    handleClose,
    handleEnd,
    handleError,
    getPowerProfileConfig,
    decoder,
  } = props;

  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var isNewConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => handleClose(remoteAddress, imei));
  conn.on("end", () => handleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => handleError(remoteAddress, imei, err));

  /** Create generic functions for socket connection */
  const disconnect = () => serverSocketDisconnect(imei, remoteAddress, conn);
  const sendData = (data: Buffer[] | String[]) => serverSocketSendData(imei, remoteAddress, conn, data);

  /** Handle data */
  conn.on("data", (data: Buffer) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataString: string = data.toString();
    let dataShow: string;
    let dataToUse;

    if (!["PROTO1903", "JT808", "TOPIN"].includes(protocol)) {
      printMessage(`[${tempImei}] (${remoteAddress}) ❌ Unsupported protocol: ${protocol}.`);
      disconnect();
      return;
    }
    dataShow = protocol === "PROTO1903" ? dataString : convertAnyToHexString(data);

    try {
      dataToUse = decoder(data);

      counter++;
      if (counter > 32000) counter = 1;

      /** Check if health packet */
      if (processPacketHealth(dataString, remoteAddress, tempImei, sendData, disconnect)) return;

      /** New socket connection */
      if (isNewConnection) printMessage(`[${tempImei}] (${remoteAddress}) 🧑‍💻 is new connection.`);

      // HandleConnection -> HandlePacket
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
          /* If disconnected then exit */
          if (!conn || conn.destroyed) return;

          if (!results[0]?.imei) {
            printMessage(`[${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataShow}].`);
            disconnect();
            return;
          }
          imei = results[0].imei;
          const prefix = `[${imei}] (${remoteAddress})`;

          /** Get the las information about the IMEI */
          const imeiData: CacheImei = CACHE_IMEI.get(imei) ?? CacheImeiEmptyItem;
          console.log("IMEI DATA BEFORE GET POWER PROFILE");
          console.log(imeiData);

          /** Get power profile for the imei */
          const { newPowerProfileType, powerProfileChanged, lastPowerProfileChecked, needProfileRefresh } =
            await getPowerProfile(
              imei,
              persistence,
              imeiData.lastPowerProfileChecked,
              prefix,
              isNewConnection,
              imeiData.powerProfile,
              getPowerProfileConfig
            );

          /** update the information in the cache */
          CACHE_IMEI.updateOrCreate(imei, {
            powerProfile: newPowerProfileType,
            lastPowerProfileChecked,
          });

          const imeiData2: CacheImei = CACHE_IMEI.get(imei) ?? CacheImeiEmptyItem;
          console.log("IMEI DATA AFTER GET POWER PROFILE");
          console.log(imeiData2);

          handleProcess({
            results,
            imei,
            prefix,
            counter,
            isNewConnection,
            powerProfileChanged,
            needProfileRefresh,
            imeiData,
            newPowerProfileType,
            sendData,
          });
          isNewConnection = false;

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
