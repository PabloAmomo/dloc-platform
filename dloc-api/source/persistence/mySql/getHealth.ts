import { ConnectionConfig } from "mysql";
import { mySqlConnectionConfig } from "./functions/mySqlConnectionConfig";
import { PersistenceResult } from "../models/PersistenceResult";
import mySqlQueryAsync from "./functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getHealth = async () : Promise<PersistenceResult> => { 
  /** Create query */
  const params: any[] = [];
  const sql = `SELECT COUNT(*) FROM device LIMIT 1;`;

  /** Execute query */
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return (response.error) ? { error: response.error, results: [ { health: 'ko' } ] } : { results: [ { health: 'ok' } ] };
  });
  return response;
};

export { getHealth };
