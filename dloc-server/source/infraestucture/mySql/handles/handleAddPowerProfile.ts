import { ConnectionConfig } from "mysql";
import { mySqlConnectionConfig } from "../functions/mySqlConnectionConfig";
import { PersistenceResult } from "../../models/PersistenceResult";
import mySqlQueryAsync from "../functions/mySqlQueryAsync";
import { PowerProfileType } from "../../../enums/PowerProfileType";
import { Protocols } from "../../../enums/Protocols";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const handleAddPowerProfile = async (
  imei: string,
  protocol: Protocols,
  powerProfileType: PowerProfileType
): Promise<PersistenceResult> => {
  const params = [imei, protocol.toLowerCase(), powerProfileType, protocol.toLowerCase(), powerProfileType];

  const sql = `INSERT INTO device (imei, protocol, powerProfile, lastVisibilityUTC) VALUES (?, ?, ?, UTC_TIMESTAMP())
                ON DUPLICATE KEY 
                UPDATE  protocol = ?, powerProfile = ?, lastVisibilityUTC = UTC_TIMESTAMP();`;
  const response: PersistenceResult = await mySqlQueryAsync(connectionConfig, sql, params);
  return response;
};

export { handleAddPowerProfile };
