import { ConnectionConfig } from 'mysql';
import { getErrorFromPositionPacket } from '../../functions/getErrorFromPositionPacket';
import { mySqlClonedImeiUpdate } from '../functions/mySqlClonedImeiUpdate';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { mySqlFormatDateTime } from '../functions/mySqlFormatDateTime';
import { mySqlGetLastPositionDateTime } from '../functions/mySqlGetLastPositionDateTime';
import { PersistenceResult } from '../../models/PersistenceResult';
import { PositionPacket } from '../../../models/PositionPacket';
import { printMessage } from '../../../functions/printMessage';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdateDevice = async (positionPacket: PositionPacket): Promise<PersistenceResult> => {
  /** Validate data */
  const { errorMsg, message } = getErrorFromPositionPacket(positionPacket);
  if (errorMsg !== '' || positionPacket.dateTimeUtc == null) {
    printMessage(message);
    return { results: [], error: new Error(errorMsg) };
  }

  /** Check if data is not old */
  const result = await mySqlGetLastPositionDateTime(positionPacket);
  if (result.error) return result;
  if (result.results.length) {
    return { results: [], error: new Error('old packet') };
  }

  /** Update data in device */
  const data = [
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
    positionPacket.lat,
    positionPacket.lng,
    positionPacket.speed,
    positionPacket.directionAngle,
    positionPacket.gsmSignal,
    positionPacket.batteryLevel,
    mySqlFormatDateTime(positionPacket.dateTimeUtc),
  ];
  const params = [
    positionPacket.imei,
    /** insert */
    ...data,
    /** update */
    ...data,
  ];
  const sql = `INSERT INTO device (imei, lastPositionUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, lastVisibilityUTC)
                          VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY 
                UPDATE  lastPositionUTC = ?, lat = ?, lng = ?, speed = ?, directionAngle = ?, gsmSignal = ?, batteryLevel = ?, lastVisibilityUTC = ?;`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, positionPacket.imei);
  return response;
};

export { handleUpdateDevice };
