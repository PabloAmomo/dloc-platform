import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { Protocols } from '../../../enums/Protocols';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddDiscarted = async (imei: string, protocol: Protocols, remoteAddress: string, reason: string, data: any): Promise<PersistenceResult> => {
  const params = [imei, protocol.toLowerCase(), remoteAddress, reason, data];
  const sql = `INSERT INTO discarted (imei, protocol, remoteAddress, reason, data) VALUES (?, ?, ?, ?, ?);`;
  return mySqlQueryAsync(connectionConfig, sql, params);
};

export { handleAddDiscarted };
