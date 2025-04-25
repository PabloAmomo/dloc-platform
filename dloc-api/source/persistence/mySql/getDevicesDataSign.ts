import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevicesDataSign: GetDevicesDataSignProps = async (userId) => {
  const params = [userId];
  const sql = `SELECT GROUP_CONCAT(CONCAT(imei, UNIX_TIMESTAMP(lastPositionUTC), UNIX_TIMESTAMP(lastVisibilityUTC)) SEPARATOR '|') as sign 
                FROM device 
                WHERE userId = ?;`;

  /** Execute query */
  const newSign: any = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? '' : response?.results?.[0]?.sign ?? '';
  });
  return newSign;
};

export { getDevicesDataSign };

interface GetDevicesDataSignProps {
  (userId: string): Promise<string>;
}
