import { ConnectionConfig } from 'mysql';
import { mySqlConnectionConfig } from '../functions/mySqlConnectionConfig';
import { PersistenceResult } from '../../models/PersistenceResult';
import mySqlQueryAsync from '../functions/mySqlQueryAsync';
import { PowerProfileType } from '../../../enums/PowerProfileType';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddPowerProfile = async (imei: string, powerProfileType: PowerProfileType): Promise<PersistenceResult> => {
  const params = [imei, powerProfileType, powerProfileType];
  const sql = `INSERT INTO device (imei, powerProfile, lastVisibilityUTC) VALUES (?, ?, UTC_TIMESTAMP())
                ON DUPLICATE KEY 
                UPDATE  powerProfile = ?, lastVisibilityUTC = UTC_TIMESTAMP();`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  return response;
};

export { handleAddPowerProfile };
