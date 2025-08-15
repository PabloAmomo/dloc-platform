import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQuerySync from '../functions/mySqlQueryAsync';
import { Protocols } from '../../../enums/Protocols';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddHistory = async (imei: string, protocol: Protocols, remoteAddress: string, data: string, response: string): Promise<PersistenceResult> => {
  const params = [imei, protocol.toLowerCase(), remoteAddress, data, response];
  const sql = `INSERT INTO history (imei, protocol, remoteAddress, data, response) VALUES (?, ?, ?, ?, ?);`;
  return mySqlQuerySync(connectionConfig, sql, params);
};

export { handleAddHistory };
