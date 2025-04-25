import { ConnectionConfig } from 'mysql';
import { DeviceParams } from '../entities/DeviceParams';
import { EncriptedData } from '../../models/EncriptedData';
import { EncriptionHelper } from '../../models/EncriptionHelper';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { SaveDeviceParamsResult } from '../models/SaveDeviceParamsResult';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const saveDeviceParams: SaveDeviceParamsProps = async (imei, userId, deviceParams, encription) => {
  /** Encrypt params */
  let encriptedParams: EncriptedData | undefined = encription.encryptDeviceParams(deviceParams, userId);
  if (!encriptedParams) { return { error: Error('internal encription error'), results: false }; }

  /** Create query */
  const params: any[] = [JSON.stringify(encriptedParams), imei];
  const sql = `UPDATE device SET params = ? WHERE imei = ?;`;

  /** Execute query */
  const response: SaveDeviceParamsResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, results: false } : { results: true };
  });
  return response;
};

export { saveDeviceParams };

interface SaveDeviceParamsProps {
  (imei: string, userId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<SaveDeviceParamsResult>;
}
