import { ConnectionConfig } from "mysql";
import { mySqlClonedImeiUpdate } from "../functions/mySqlClonedImeiUpdate";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { PersistenceResult } from "../../models/PersistenceResult";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddBatteryLevel = async (imei: string, batteryLevel: number): Promise<PersistenceResult> => {
  const updateBattery = batteryLevel !== -1;
  const params = updateBattery ? [imei, batteryLevel, batteryLevel] : [imei];

  const sql = updateBattery
    ? `
      INSERT INTO device (imei, batteryLevel, lastVisibilityUTC) VALUES (?, ?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE 
        batteryLevel = ?, 
        lastVisibilityUTC = UTC_TIMESTAMP();
    `
    : `
      INSERT INTO device (imei, lastVisibilityUTC) VALUES (?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE 
        lastVisibilityUTC = UTC_TIMESTAMP();
    `;

  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, imei);
  return response;
};

export { handleAddBatteryLevel };
