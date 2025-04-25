import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQuerySync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddHistory = async (imei: string, remoteAddress: string, data: string, response: string): Promise<PersistenceResult> => {
  const params = [imei, remoteAddress, data, response];
  const sql = `INSERT INTO history (imei, remoteAddress, data, response) VALUES (?, ?, ?, ?);`;
  return mySqlQuerySync(connectionConfig, sql, params);
};

export { handleAddHistory };
