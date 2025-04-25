import { AddShareDeviceCodeResult } from '../models/AddShareDeviceCodeResult';
import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const addShareDeviceCode: AddShareDeviceCodeProps = async (imei, verificationCode) => {
  /** Create query */
  let params: string[] = [imei, verificationCode, verificationCode];
  let sql: string = `INSERT 
                        INTO shared_codes (imei, verificationCode)
                        VALUES (?, ?)
                        ON DUPLICATE KEY UPDATE
                        verificationCode = ?;`;

  /** Execute query */
  const response: AddShareDeviceCodeResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, results: false } : { results: true };
  });

  return response;
};

export { addShareDeviceCode };

interface AddShareDeviceCodeProps {
  (imei: string, verificationCode: string): Promise<AddShareDeviceCodeResult>;
}
