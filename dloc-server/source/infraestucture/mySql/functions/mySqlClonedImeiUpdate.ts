import { ConnectionConfig } from 'mysql';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from './mySqlQueryAsync';
import { printMessage } from '../../../functions/printMessage';

const mySqlClonedImeiUpdate = async (connectionConfig: ConnectionConfig, imei: string) => {
  const params = [imei, imei];
  const sql = `UPDATE device Tclone
                JOIN (
                    SELECT * FROM device
                    WHERE imei = ?
                ) Toriginal
                ON Tclone.clonedImei = ?
                SET 
                  Tclone.lastPositionUTC   = Toriginal.lastPositionUTC,
                  Tclone.lat               = Toriginal.lat,
                  Tclone.lng               = Toriginal.lng,
                  Tclone.speed             = Toriginal.speed,
                  Tclone.directionAngle    = Toriginal.directionAngle,
                  Tclone.gsmSignal         = Toriginal.gsmSignal,
                  Tclone.batteryLevel      = Toriginal.batteryLevel,
                  Tclone.lastVisibilityUTC = Toriginal.lastVisibilityUTC;`;

  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (response.error) printMessage(`Error on mySqlCopyImei: ${response.error?.message || response.error}`);
};

export { mySqlClonedImeiUpdate  };
