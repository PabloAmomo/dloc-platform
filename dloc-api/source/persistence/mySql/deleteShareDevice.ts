import { ConnectionConfig } from 'mysql';
import { DeleteShareDeviceResult } from '../models/DeleteShareDeviceResult';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const deleteShareDevice: DeleteShareDeviceProps = async (imei, sharedImeiId) => {
  /** Create query to delete the share device */
  const params: string[] = [sharedImeiId, imei];
  const sql: string = `DELETE FROM device WHERE imei = ? AND clonedImei = ?;`;

  /** Execute query */
  const response: DeleteShareDeviceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, results: false } : { results: true };
  });

  /** Return results */
  return response;
};

export { deleteShareDevice };

interface DeleteShareDeviceProps {
  (imei: string, sharedImeiId: string): Promise<DeleteShareDeviceResult>;
}
