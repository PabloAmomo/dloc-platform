import { CacheGetTokenDataResult } from '../models/CacheGetTokenDataResult';
import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const cacheGetTokenData: CacheGetTokenDataProps = async (tokenId) => {
  /** Create query */
  const params: any[] = [tokenId];
  const sql = `SELECT data FROM cache_tokens WHERE tokenId = ? LIMIT 1;`;

  /** Execute query */
  const response: CacheGetTokenDataResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, result: '' } : { result: response?.results?.[0]?.data ?? '' };
  });
  return response;
};

export { cacheGetTokenData };

interface CacheGetTokenDataProps {
  (tokenId: string): Promise<CacheGetTokenDataResult>;
}
