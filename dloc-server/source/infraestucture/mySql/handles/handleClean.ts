import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import { printMessage } from '../../../functions/printMessage';
import mySqlQuerySync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleClean = async (): Promise<PersistenceResult> => {
  var error: Error | null = null;
  
  /** Error handler */
  const onError = (err: Error, on: string) => {
    error = err;
    printMessage(`Cleaning ${on} error: ${err.message}`);
  };

  /** Clean */
  await mySqlQuerySync(connectionConfig, 'DELETE FROM dloc.history WHERE creationDate <= date_sub(now(), INTERVAL 7 DAY);', []).then((result) => {
    if (result.error != null) onError(result.error, 'history');
  });
  await mySqlQuerySync(connectionConfig, 'DELETE FROM dloc.discarted WHERE creationDate <= date_sub(now(), INTERVAL 7 DAY);', []).then((result) => {
    if (result.error != null) onError(result.error, 'discarted');
  });
  await mySqlQuerySync(connectionConfig, 'DELETE FROM dloc.`position` WHERE creationDate <= date_sub(now(), INTERVAL 7 DAY);', []).then((result) => {
    if (result.error != null) onError(result.error, 'position');
  });

  /** Return */
  return { results: [], error };
};

export { handleClean };
