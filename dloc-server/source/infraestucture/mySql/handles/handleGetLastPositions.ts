import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleGetLastPositions = async (imei: string, timeInSec : number = 300): Promise<PersistenceResult> => {
  const params = [timeInSec, imei];
  const sql = `SELECT *
                FROM dloc.position
                WHERE creationDate >= NOW() - INTERVAL ? SECOND and imei = ?;`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  return response;
};

export { handleGetLastPositions };