import { ConnectionConfig } from 'mysql';
import mySqlQueryAsync from './functions/mySqlQueryAsync';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const isDeviceOwner: IsDeviceOwnerProps = async (imei, userId) => {
  /** Create query */
  const params: any[] = [imei, userId];
  const sql: string = `SELECT COUNT(imei) as count FROM device WHERE imei = ? AND userId = ?;`;

  /** Execute query */
  const isOwner = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? false : response.results[0]['count'] === 1;
  });
  return isOwner;
};

export { isDeviceOwner };

interface IsDeviceOwnerProps {
  (imei: string, userId: string): Promise<boolean>;
}
