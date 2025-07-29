import { ConnectionConfig } from "mysql";
import { mySqlConnectionConfig } from "./functions/mySqlConnectionConfig";
import mySqlQueryAsync from "./functions/mySqlQueryAsync";
import { UpdatePowerProfileResult } from "../models/UpdatePowerProfileResult";
import { PowerProfileType } from "../../enums/PowerProfileType";

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const updatePowerProfile: updatePowerProfileProps = async (
  imei,
  powerProfileType,
  userId
) => {
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

export { updatePowerProfile };

interface updatePowerProfileProps {
  (
    imei: string,
    powerProfile: PowerProfileType,
    userId: string
  ): Promise<UpdatePowerProfileResult>;
}
