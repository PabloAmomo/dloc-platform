import { ConnectionConfig } from 'mysql';
import { mySqlClonedImeiUpdate } from '../functions/mySqlClonedImeiUpdate';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { PowerProfileType } from '../../../enums/PowerProfileType';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdatePowerProfile = async (imei: string, powerProfile: PowerProfileType): Promise<PersistenceResult> => {
  const params = [powerProfile, imei];
  const sql = `UPDATE device SET powerProfile = ? WHERE imei = ?;`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, imei);
  return response;
};

export { handleUpdatePowerProfile };
