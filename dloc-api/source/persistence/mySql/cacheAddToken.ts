import { CacheAddTokenResult } from '../models/CacheAddTokenResult';
import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const cacheAddToken: CacheAddTokenProps = async (tokenId, encriptedData) => {
  /** Create query */
  const params: any[] = [tokenId, encriptedData, encriptedData];
  const sql = `INSERT INTO cache_tokens (tokenId, data) VALUES (?,?) ON DUPLICATE KEY UPDATE data=?;`;

  /** Execute query */
  const response: CacheAddTokenResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, results: false } : { results: true };
  });
  return response;
};

export { cacheAddToken };

interface CacheAddTokenProps {
  (tokenId: string, encriptedData: string): Promise<CacheAddTokenResult>;
}
