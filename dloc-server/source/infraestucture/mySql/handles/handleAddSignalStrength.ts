import { ConnectionConfig } from "mysql";
import { mySqlClonedImeiUpdate } from "../functions/mySqlClonedImeiUpdate";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { PersistenceResult } from "../../models/PersistenceResult";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";
import { Protocols } from "../../../enums/Protocols";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddSignalStrength = async (
  imei: string,
  protocol: Protocols,
  signalStrength: number
): Promise<PersistenceResult> => {
  const updateSignalStrength = signalStrength !== -1;
  const params = updateSignalStrength
    ? [imei, protocol.toLowerCase(), signalStrength, protocol.toLowerCase(), signalStrength]
    : [imei, protocol.toLowerCase(), protocol.toLowerCase()];

  const sql = updateSignalStrength
    ? `
      INSERT INTO device (imei, protocol, gsmSignal, lastVisibilityUTC)
      VALUES (?, ?, ?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE 
        protocol = ?,
        gsmSignal = ?, 
        lastVisibilityUTC = UTC_TIMESTAMP();
    `
    : `
      INSERT INTO device (imei, protocol, lastVisibilityUTC)
      VALUES (?, ?, UTC_TIMESTAMP())
      ON DUPLICATE KEY UPDATE 
        protocol = ?,
        lastVisibilityUTC = UTC_TIMESTAMP();
    `;

  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, imei);
  return response;
};

export { handleAddSignalStrength };
