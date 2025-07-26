import { ConnectionConfig } from "mysql";
import { mySqlClonedImeiUpdate } from "../functions/mySqlClonedImeiUpdate";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { PersistenceResult } from "../../models/PersistenceResult";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddSignalStrength = async (
  imei: string,
  signalStrength: number
): Promise<PersistenceResult> => {
  const updateSignalStrength = signalStrength !== -1;
  const params = updateSignalStrength ? [imei, signalStrength, signalStrength] : [imei];

  const sql = updateSignalStrength
    ? `
      INSERT INTO device (imei, gsmSignal, lastVisibilityUTC)
      VALUES (?, ?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE 
        gsmSignal = ?, 
        lastVisibilityUTC = UTC_TIMESTAMP();
    `
    : `
      INSERT INTO device (imei, lastVisibilityUTC)
      VALUES (?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE 
        lastVisibilityUTC = UTC_TIMESTAMP();
    `;

  const response: PersistenceResult = await mySqlQueryAsync(
    connectionConfig,
    sql,
    params
  );
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, imei);
  return response;
};

export { handleAddSignalStrength };
