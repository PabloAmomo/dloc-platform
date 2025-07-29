import { ConnectionConfig } from 'mysql';
import { mySqlClonedImeiUpdate } from '../functions/mySqlClonedImeiUpdate';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdateLastActivity = async (imei: string): Promise<PersistenceResult> => {
  const params = [imei];
  const sql = `INSERT INTO device (imei, lastVisibilityUTC) VALUES (?, UTC_TIMESTAMP())
                ON DUPLICATE KEY 
                UPDATE lastVisibilityUTC = UTC_TIMESTAMP();`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, imei);
  return response;
};

export { handleUpdateLastActivity };
