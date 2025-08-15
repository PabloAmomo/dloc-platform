import { ConnectionConfig } from "mysql";
import { mySqlClonedImeiUpdate } from "../functions/mySqlClonedImeiUpdate";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { PersistenceResult } from "../../models/PersistenceResult";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";
import { Protocols } from "../../../enums/Protocols";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleUpdateLastActivity = async (imei: string, protocol: Protocols): Promise<PersistenceResult> => {
  const params = [imei, protocol.toLowerCase(), protocol.toLowerCase()];
  const sql = `INSERT INTO device (imei, protocol, lastVisibilityUTC) VALUES (?, ?, UTC_TIMESTAMP())
                ON DUPLICATE KEY 
                UPDATE protocol = ?, lastVisibilityUTC = UTC_TIMESTAMP();`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  if (!response?.error) await mySqlClonedImeiUpdate(connectionConfig, imei);
  return response;
};

export { handleUpdateLastActivity };
