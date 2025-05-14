import { ConnectionConfig } from "mysql";
import { mySqlConnectionConfig } from "./functions/mySqlConnectionConfig";
import mySqlQueryAsync from "./functions/mySqlQueryAsync";
import { PowerProfileType } from "../../enums/powerProfileType";
import { UpdatePowerProfileResult } from "../models/UpdatePowerProfileResult";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const udpdatePowerProfile: udpdatePowerProfileProps = async (
  imei,
  powerProfileType,
  userId
) => {
  /** Encrypt params */

  /** Create query */
  const params: any[] = [powerProfileType.toLowerCase(), imei, userId];
  const sql: string = `UPDATE device SET powerProfile = ? WHERE imei = ? and userId = ?;`;

  /** Execute query */
  const response: UpdatePowerProfileResult = await mySqlQueryAsync(
    connectionConfig,
    sql,
    params
  ).then((response) => {
    return response.error
      ? { error: response.error, results: false }
      : { results: true };
  });

  /** Return results */
  return response;
};

export { udpdatePowerProfile };

interface udpdatePowerProfileProps {
  (
    imei: string,
    powerProfile: PowerProfileType,
    userId: string
  ): Promise<UpdatePowerProfileResult>;
}
