import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQuerySync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleHealth = async (): Promise<PersistenceResult> => {
  /** Arbitrary query */
  return mySqlQuerySync(connectionConfig, 'SELECT (1) LIMIT 1;', []);
};

export { handleHealth };
