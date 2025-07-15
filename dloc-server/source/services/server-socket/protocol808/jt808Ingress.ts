import net from "node:net";

import { PowerProfileType } from "../../../enums/PowerProfileType";
import convertStringToHexString from "../../../functions/convertStringToHexString";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import getPowerProfile from "../../../functions/getPowerProfile";
import { printMessage } from "../../../functions/printMessage";
import processPacketHealth from "../../../functions/processPacketHealth";
import { getRemoteAddress } from "../../../functions/remoteAddress";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../../infraestucture/caches/cacheIMEI";
import { CacheImei } from "../../../infraestucture/models/CacheImei";
import { Persistence } from "../../../models/Persistence";
import jt808HandleClose from "./connection/jt808HandleClose";
import jt808HandleEnd from "./connection/jt808HandleEnd";
import jt808HandleError from "./connection/jt808HandleError";
import jt808HandlePacket from "./connection/jt808HandlePacket";
import jt808HandleConnection from "./connection/jt808HandleConnection";
import jt808HandleProcess from "./connection/jt808HandleProcess";

const jt808Ingress = (conn: net.Socket, persistence: Persistence) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var newConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => jt808HandleClose(remoteAddress, imei));
  conn.on("end", () => jt808HandleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => jt808HandleError(remoteAddress, imei, err));

  /** Handle data */
  conn.on("data", (data: Buffer) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataString: string = data.toString();
    const dataShow: string = convertStringToHexString(data);
    const dataToUse: Buffer = data;

    counter++;
    if (counter > 32000) counter = 1;

    try {
      /** Check if health packet */
      if (processPacketHealth(conn, dataString, remoteAddress, tempImei))
        return;

      /** New socket connection */
      if (newConnection)
        printMessage(`[${tempImei}] (${remoteAddress}) 🧑‍💻 new connection.`);

      /** Handle data */
      jt808HandleConnection({
        imei,
        remoteAddress,
        data: dataToUse,
        handlePacket: jt808HandlePacket,
        persistence,
        conn,
        counter,
      })
        .then(async (results) => {
          if (!results[0]?.imei) {
            printMessage(
              `[${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataShow}].`
            );
            conn.destroy();
            return;
          }
          imei = results[0].imei;
          const prefix = `[${imei}] (${remoteAddress})`;

          for (const result of results) {
            if (result.mustDisconnect) {
              printMessage(
                `[${tempImei}] (${remoteAddress}) ❌ Connection must be closed. (Request by the platform)`
              );
              conn.destroy();
              return;
            }
          }

          printMessage(`${prefix} 🌟 Current serial counter [${counter}].`);

          /** Get the las information about the IMEI */
          const imeiData: CacheImei = CACHE_IMEI.get(imei) ?? {
            powerProfile: PowerProfileType.AUTOMATIC_MINIMAL,
            lastPowerProfileChecked: 0,
            lastLBSRequestTimestamp: 0,
            socketConn: conn,
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
            socketConn: conn,
            powerProfile: newPowerProfile,
            lastPowerProfileChecked,
          });

          const powerPrfChanged = imeiData.powerProfile !== newPowerProfile;

          jt808HandleProcess({
            conn,
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
          });
          newConnection = false;

          //
        })
        .catch((err: Error) => {
          throw err;
        });
    } catch (err: Error | any) {
      conn.destroy();

      /** Clear cache for the imei */
      clearItemInCacheIMEI(imei);

      printMessage(
        `[${tempImei}] (${remoteAddress}) ❌ error handling data (${
          err?.message ?? "unknown error"
        }) data [${dataShow}].`
      );
    }
  });
};

export default jt808Ingress;
