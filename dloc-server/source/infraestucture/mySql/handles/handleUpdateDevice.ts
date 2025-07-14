import { ConnectionConfig } from "mysql";
import { getErrorFromPositionPacket } from "../../functions/getErrorFromPositionPacket";
import { mySqlClonedImeiUpdate } from "../functions/mySqlClonedImeiUpdate";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { mySqlFormatDateTime } from "../functions/mySqlFormatDateTime";
import { mySqlGetLastPositionDateTime } from "../functions/mySqlGetLastPositionDateTime";
import { PersistenceResult } from "../../models/PersistenceResult";
import { PositionPacket } from "../../../models/PositionPacket";
import { printMessage } from "../../../functions/printMessage";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdateDevice = async (
  positionPacket: PositionPacket
): Promise<PersistenceResult> => {
  /** Validate data */
  const { errorMsg, message } = getErrorFromPositionPacket(positionPacket);
  if (errorMsg !== "" || positionPacket.dateTimeUtc == null) {
    printMessage(message);
    return { results: [], error: new Error(errorMsg) };
  }

  /** Check if data is not old */
  const result = await mySqlGetLastPositionDateTime(positionPacket);
  if (result.error) return result;
  if (result.results.length) {
    return { results: [], error: new Error("old packet") };
  }

  const data = [
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
    positionPacket.lat,
    positionPacket.lng,
    positionPacket.speed,
    positionPacket.directionAngle,
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
    positionPacket.accuracy,
    positionPacket.activity,
  ];

  const hasGsmSignal =
    positionPacket.gsmSignal !== undefined && positionPacket.gsmSignal >= 0;
  const hasBattery =
    positionPacket.batteryLevel !== undefined &&
    positionPacket.batteryLevel >= 0;

  if (hasGsmSignal) data.push(positionPacket.gsmSignal);
  if (hasBattery) data.push(positionPacket.batteryLevel);

  const params = [
    positionPacket.imei,
    /** insert */
    ...data,
    /** update */
    ...data,
  ];

  const sql = `INSERT INTO device (imei, lastPositionUTC, lat, lng, speed, directionAngle, lastVisibilityUTC, locationAccuracy, activity ${hasGsmSignal ? ",gsmSignal" : ""} ${hasBattery ? ",batteryLevel" : ""})
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ? ${hasGsmSignal ? ",?" : ""} ${hasBattery ? ",?" : ""})
                ON DUPLICATE KEY 
                  UPDATE  lastPositionUTC = ?, lat = ?, lng = ?, speed = ?, directionAngle = ?, lastVisibilityUTC = ?, locationAccuracy = ?, activity = ? ${hasGsmSignal ? ",gsmSignal = ?" : ""} ${hasBattery ? ",batteryLevel = ?" : ""};`;
  const response: PersistenceResult = await mySqlQueryAsync(
    connectionConfig,
    sql,
    params
  );

  if (!response?.error)
    await mySqlClonedImeiUpdate(connectionConfig, positionPacket.imei);
  return response;
};

export { handleUpdateDevice };
