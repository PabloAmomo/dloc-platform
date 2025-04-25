import { AddDeviceResult } from '../models/AddDeviceResult';
import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const deleteDevice: DeleteDeviceProps = async (imei, userId) => {
  /** Create the query */
  const params: any[] = [imei, userId];
  const sql: string = `UPDATE device SET params = '{}', userId = NULL WHERE imei = ? and userId = ?;`;

  /** Execute query */
  const response: AddDeviceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, results: false } : { results: true };
  });
  return response;
};

export { deleteDevice };

interface DeleteDeviceProps {
  (imei: string, userId: string): Promise<AddDeviceResult>;
}
