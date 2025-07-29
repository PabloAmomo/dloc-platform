import mysql from 'mysql';
import { mySqlConnection } from './mySqlConnection';
import { PersistenceResult } from '../../models/PersistenceResult';

/** Query database (SELECT, UPDATE, INSERT...) */
const mySqlQueryAsync = async (connectionConfig: mysql.ConnectionConfig, sql: string, values: any[]): Promise<PersistenceResult> => {
  const response: PersistenceResult = {
    results: [],
    error: null,
  };

  try {
    const connection = mySqlConnection(connectionConfig);
   
    /** Connect to dabase */
    await new Promise((resolve) => {
      connection.on('error', (error: Error) => (response.error = error));
      connection.connect((error: mysql.MysqlError | null) => {
        if (error) response.error = new Error(error?.code);
        resolve(0);
      });
    });
    if (response.error) return response;

    /** Query database */
    await new Promise((resolve) => {
      connection.query(sql, values, (error: mysql.MysqlError | null, results: any[]) => {
        response.results = results;
        if (error) response.error = new Error(error?.code);
        connection.end();
        resolve(0);
      });
    });
  } catch (err: Error | any) {
    response.error = err?.message ? err : new Error('unknown error');
  }

  /** Return response */
  return response;
};

export default mySqlQueryAsync;
