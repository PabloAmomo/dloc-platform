import { ConnectionConfig } from "mysql";
import { getErrorFromPositionPacket } from "../../functions/getErrorFromPositionPacket";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { mySqlFormatDateTime } from "../functions/mySqlFormatDateTime";
import { PersistenceResult } from "../../models/PersistenceResult";
import { PositionPacket } from "../../../models/PositionPacket";
import { printMessage } from "../../../functions/printMessage";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddPosition = async (
  positionPacket: PositionPacket
): Promise<PersistenceResult> => {
  /** validate data */
  const { errorMsg, message } = getErrorFromPositionPacket(positionPacket);
  if (errorMsg !== "" || positionPacket.dateTimeUtc == null) {
    printMessage(message);
    return { results: [], error: new Error(errorMsg) };
  }

  const hasGsmSignal =
    positionPacket.gsmSignal !== undefined && positionPacket.gsmSignal >= 0;
  const hasBattery =
    positionPacket.batteryLevel !== undefined &&
    positionPacket.batteryLevel >= 0;

  /** Add position */
  const params = [
    positionPacket.imei,
    positionPacket.remoteAddress,
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
    positionPacket.lat,
    positionPacket.lng,
    positionPacket.speed,
    positionPacket.directionAngle,
    positionPacket.accuracy,
    positionPacket.activity,
  ];
  if (hasGsmSignal) params.push(positionPacket.gsmSignal);
  if (hasBattery) params.push(positionPacket.batteryLevel);

  const sql = `INSERT INTO \`position\` 
    (imei, remoteAddress, dateTimeUTC, lat, lng, speed, directionAngle, locationAccuracy, activity ${hasGsmSignal ? ",gsmSignal" : ""} ${hasBattery ? ",batteryLevel" : ""}) 
    VALUES 
    (?, ?, ?, ?, ?, ?, ?, ?, ? ${hasGsmSignal ? ",?" : ""} ${hasBattery ? ",?" : ""});`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddPosition };
