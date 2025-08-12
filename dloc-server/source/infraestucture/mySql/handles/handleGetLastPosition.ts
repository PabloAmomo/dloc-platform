import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleGetLastPosition = async (imei: string): Promise<PersistenceResult> => {
  const params = [imei];
  const sql = `SELECT lat, lng, lastVisibilityUTC, locationAccuracy FROM device WHERE imei = ?;`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  return response;
};

export { handleGetLastPosition };
