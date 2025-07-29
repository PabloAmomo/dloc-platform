import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { printMessage } from '../../functions/printMessage';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const cacheRemoveToken: CacheRemoveTokenProps = async (tokenId) => {
  /** Create query */
  const params: any[] = [tokenId];
  const sql = `DELETE FROM cache_tokens WHERE tokenId = ?;`;

  /** Execute query */
  await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    if (response.error) printMessage(`Error: (cacheRemoveToken) ${response.error}`);
  });
};

export { cacheRemoveToken };

interface CacheRemoveTokenProps {
  (tokenId: string): Promise<void>;
}
