import { AddDeviceResult } from '../models/AddDeviceResult';
import { ConnectionConfig } from 'mysql';
import { DeviceParams } from '../entities/DeviceParams';
import { EncriptedData } from '../../models/EncriptedData';
import { EncriptionHelper as EncriptionHelper } from '../../models/EncriptionHelper';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const addDevice: addDeviceProps = async (imei, userId, deviceParams, encription) => {
  /** Encrypt params */
  // TOODO: Consider moving this to service layer
  let encriptedParams: EncriptedData | undefined = encription.encryptDeviceParams(deviceParams, userId);
  if (!encriptedParams) { return { error: Error('internal encription error'), results: false }; }

  /** Create query */
  const params: any[] = [JSON.stringify(encriptedParams), userId, imei];
  const sql: string = `UPDATE device SET params = ?, userId = ? WHERE imei = ? and userId IS NULL;`;

  /** Execute query */
  const response: AddDeviceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, results: false } : { results: true };
  });

  /** Return results */
  return response;
};

export { addDevice };

interface addDeviceProps {
  (imei: string, userId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<AddDeviceResult>;
}
