import { ConnectionConfig } from 'mysql';
import { mySqlClonedImeiUpdate } from '../functions/mySqlClonedImeiUpdate';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddBatteryLevel = async (imei: string, batteryLevel: number): Promise<PersistenceResult> => {
  const params = [imei, batteryLevel, batteryLevel];
  const sql = `INSERT INTO device (imei, batteryLevel, lastVisibilityUTC) VALUES (?, ?, UTC_TIMESTAMP())
                ON DUPLICATE KEY 
                UPDATE  batteryLevel = ?, lastVisibilityUTC = UTC_TIMESTAMP();`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, imei);
  return response;
};

export { handleAddBatteryLevel };
