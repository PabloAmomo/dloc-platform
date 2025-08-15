import { ConnectionConfig } from "mysql";
import { mySqlClonedImeiUpdate } from "../functions/mySqlClonedImeiUpdate";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { PersistenceResult } from "../../models/PersistenceResult";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";
import { Protocols } from "../../../enums/Protocols";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddBatteryLevel = async (
  imei: string,
  protocol: Protocols,
  batteryLevel: number
): Promise<PersistenceResult> => {
  const updateBattery = batteryLevel !== -1;
  const params = updateBattery
    ? [imei, protocol.toLowerCase(), batteryLevel, protocol.toLowerCase(), batteryLevel]
    : [imei, protocol.toLowerCase(), protocol.toLowerCase()];

  const sql = updateBattery
    ? `
      INSERT INTO device (imei, protocol, batteryLevel, lastVisibilityUTC) VALUES (?, ?, ?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE 
        protocol = ?,
        batteryLevel = ?, 
        lastVisibilityUTC = UTC_TIMESTAMP();
    `
    : `
      INSERT INTO device (imei, protocol, lastVisibilityUTC) VALUES (?, ?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE 
        protocol = ?,
        lastVisibilityUTC = UTC_TIMESTAMP();
    `;

  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, imei);
  return response;
};

export { handleAddBatteryLevel };
