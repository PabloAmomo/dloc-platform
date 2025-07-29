import mysql from 'mysql';

const mySqlConnection = (ConnectionConfig: mysql.ConnectionConfig) : mysql.Connection =>
  mysql.createConnection(ConnectionConfig);

export { mySqlConnection };
