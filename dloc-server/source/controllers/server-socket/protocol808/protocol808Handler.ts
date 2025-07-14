import { handlePacket } from "../../../services/server-socket/protocol808/connection/handlePacket";
import { Persistence } from "../../../models/Persistence";
import { printMessage } from "../../../functions/printMessage";
import { getRemoteAddress } from "../../../functions/remoteAddress";
import handleClose from "../../../services/server-socket/protocol808/connection/handleClose";
import handler from "../../../services/server-socket/protocol808/handler";
import handleEnd from "../../../services/server-socket/protocol808/connection/handleEnd";
import handleError from "../../../services/server-socket/protocol808/connection/handleError";
import net from "node:net";
import { CACHE_POSITION } from "../../../infraestucture/caches/cachePosition";
import {
  CACHE_IMEI,
  clearItemInCacheIMEI,
} from "../../../infraestucture/caches/cacheIMEI";
import { getNormalizedIMEI } from "../../../functions/getNormalizedIMEI";
import powerProfileConfig from "../../../functions/powerProfileConfig";
import getPowerProfile from "../../../functions/getPowerProfile";
import convertStringToHexString from "../../../functions/convertStringToHexString";
import jt808FrameEncode from "../../../services/server-socket/protocol808/functions/jt808FrameEncode";
import jt808CreatePowerProfilePacket from "../../../services/server-socket/protocol808/functions/jt808CreatePowerProfilePacket";
import { CachePosition } from "../../../infraestucture/models/CachePosition";
import jt808CreateParameterSettingPacket from "../../../services/server-socket/protocol808/functions/jt808CreateParameterSettingPacket";
import createHexFromNumberWithNBytes from "../../../functions/createHexFromNumberWithNBytes";
import jt808CreateCheckParameterSettingPacket from "../../../services/server-socket/protocol808/functions/jt808CreateCheckParameterSettingPacket";
import processPacketHealth from "../../../functions/processPacketHealth";

// TODO: Unificar handlers para protocolo 808 y 1903

const protocol808Handler = (conn: net.Socket, persistence: Persistence) => {
  const remoteAddress: string = getRemoteAddress(conn);
  var imei: string = "";
  var newConnection: boolean = true;
  var counter = 0;

  /** Create event listeners for socket connection */
  conn.once("close", () => handleClose(remoteAddress, imei));
  conn.on("end", () => handleEnd(remoteAddress, imei));
  conn.on("error", (err: Error) => handleError(remoteAddress, imei, err));

  /** Handle data */
  conn.on("data", (data: any) => {
    const tempImei: string = getNormalizedIMEI(imei);
    const dataHexString: string = convertStringToHexString(data);
    const dataString: string = data.toString();

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
      handler({
        imei,
        remoteAddress,
        data,
        handlePacket,
        persistence,
        conn,
        counter,
      })
        .then(async (results) => {
          if (!results[0]?.imei) {
            printMessage(
              `${tempImei}] (${remoteAddress}) ❌ IMEI not found in data [${dataHexString}].`
            );
            conn.destroy();
            return;
          }
          imei = results[0].imei;

          const prefix = `[${imei}] (${remoteAddress})`;

          printMessage(`${prefix} 🌟 Current serial counter [${counter}].`);

          /** Get the las information about the IMEI */
          const imeiData = CACHE_IMEI.get(imei);

          /** Get power profile for the imei */
          const {
            powerProfile,
            lastPowerProfileChecked,
            needProfileRefresh,
            movementsControlSeconds,
          } = await getPowerProfile(
            imei,
            persistence,
            imeiData?.lastPowerProfileChecked ?? Date.now(),
            prefix,
            newConnection
          );
          const { uploadSec, heartBeatSec } = powerProfileConfig(powerProfile);

          /** Get last position packet */
          const lastPosPacket: CachePosition | undefined =
            CACHE_POSITION.get(imei);

          /** create or update socket connection to cache */
          CACHE_IMEI.updateOrCreate(imei, {
            socketConn: conn,
            powerProfile,
            lastPowerProfileChecked,
          });
          const powerPrfChanged =
            imeiData?.powerProfile && imeiData?.powerProfile !== powerProfile;

          /** If new connection send configuration after response */
          if (newConnection || powerPrfChanged || needProfileRefresh) {
            if (needProfileRefresh) {
              printMessage(
                `${prefix} 🔄 power profile refresh needed, current profile [${powerProfile}]`
              );
            }

            if (powerPrfChanged)
              printMessage(
                `${prefix} ⚡️ power profile changed from [${imeiData?.powerProfile}] to [${powerProfile}]`
              );

            printMessage(
              `${prefix} 📡 send Upload Interval [${uploadSec} sec] - Heartbeat [${heartBeatSec}]`
            );

            const terminalId = imei.slice(-12);

            /** Create Power Profile Packet */
            const powerPacket = jt808CreatePowerProfilePacket(
              terminalId,
              counter + 200,
              powerProfile,
              movementsControlSeconds * 2
            );
            printMessage(
              `${prefix} 🔋 Power config Packet sent: ${convertStringToHexString(
                powerPacket
              )}`
            );
            (results[0].response as Buffer[]).push(powerPacket);

            /* Create HeartBeat Packet */
            const heartBeatPacket = jt808CreateParameterSettingPacket(
              terminalId,
              counter + 201,
              ["00000001 04 " + createHexFromNumberWithNBytes(heartBeatSec, 4)]
            );
            printMessage(
              `${prefix} ❤️  Heart beat config Packet sent: ${convertStringToHexString(
                heartBeatPacket
              )}`
            );
            (results[0].response as Buffer[]).push(heartBeatPacket);

            /* Ask for parameters settings */
            (results[0].response as Buffer[]).push(
              jt808CreateCheckParameterSettingPacket(
                terminalId,
                counter + 202,
                []
              )
            );
            printMessage(`${prefix} ⚙️  Parameters setting Packet sent`);

            newConnection = false;
          }

          /** Send */
          for (const result of results) {
            for (const response of result.response) {
              conn.write(jt808FrameEncode(response as Buffer));
              conn.write(Buffer.alloc(0));
            }
          }
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
        }) data [${dataHexString}].`
      );
    }
  });
};

export { protocol808Handler };
