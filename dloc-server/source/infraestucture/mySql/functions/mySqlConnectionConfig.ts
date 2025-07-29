import { configDotenv } from 'dotenv';
import { ConnectionConfig } from 'mysql';

configDotenv();

const mySqlConnectionConfig: ConnectionConfig = {
  host: `${process.env.MYSQL_HOST}`,
  user: process.env.MYSQL_USER || '',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || '',
  port: parseInt(process.env.MYSQL_PORT ?? '3306'),
};

export { mySqlConnectionConfig };