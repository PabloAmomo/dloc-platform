import { ConnectionConfig } from 'mysql';
import { DeviceParams } from '../entities/DeviceParams';
import { EncriptionHelper } from '../../models/EncriptionHelper';
import { GetDeviceParamsResult } from '../models/GetDeviceParamsResult';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';
import { EncriptedData } from '../../models/EncriptedData';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDeviceParams: GetDeviceParamsProps = async (imei, userId, encription) => {
  /** Create query */
  const params: any[] = [imei, userId];
  const sql = `SELECT params FROM device WHERE imei = ? and userId = ?;`;

  /** Execute query */
  const response: any = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error } : { results: response.results[0].params };
  });
  if (response.error) return { error: response.error, results: undefined };

  /** Decrypt params */
  const encriptedParams: EncriptedData = JSON.parse(response.results ?? '{}');
  const deviceParams: DeviceParams | undefined = encription.decryptDeviceParams(encriptedParams, userId);
  if (!deviceParams) return { error: Error('internal decription error'), results: undefined };

  /** Return results */
  return { results: deviceParams };
};

export { getDeviceParams };

interface GetDeviceParamsProps {
  (imei: string, userId: string, encription: EncriptionHelper): Promise<GetDeviceParamsResult>;
}
