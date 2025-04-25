import { AddShareDeviceCodeResult } from '../models/AddShareDeviceCodeResult';
import { ConnectionConfig } from 'mysql';
import { DeleteShareDeviceCodeResult } from '../models/DeleteShareDeviceCodeResult';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const deleteShareDeviceCode: DeleteShareDeviceCodeProps = async (imei) => {
  /** Create query */
  let params: string[] = [imei];
  let sql: string = `DELETE FROM shared_codes WHERE imei = ?;`;

  /** Execute query */
  const response: AddShareDeviceCodeResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Return results */
    return response.error ? { error: response.error, results: false } : { results: true };
  });

  return response;
};

export { deleteShareDeviceCode };

interface DeleteShareDeviceCodeProps {
  (imei: string): Promise<DeleteShareDeviceCodeResult>;
}
