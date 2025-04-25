import { AddShareDeviceResult } from '../models/AddShareDeviceResult';
import { ConnectionConfig } from 'mysql';
import { DeviceParams } from '../entities/DeviceParams';
import { EncriptedData } from '../../models/EncriptedData';
import { EncriptionHelper } from '../../models/EncriptionHelper';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { printMessage } from '../../functions/printMessage';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const addShareDevice: AddShareDeviceProps = async (imei, userId, sharedImeiId, deviceParams, encription) => {
  /** Encrypt params */
  const encriptedParams: EncriptedData | undefined = encription.encryptDeviceParams(deviceParams, userId);
  const encriptedParamsString: string = JSON.stringify(encriptedParams ?? {});

  /** Create query to create or update the share device */
  let params: string[] = [encriptedParamsString, sharedImeiId, imei];
  let sql: string = 
    'INSERT INTO device (params, imei, clonedImei) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE params = params, creationDate = NOW(), userId = NULL;';

  /** Execute query */
  const addShareDeviceResult: AddShareDeviceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, results: false } : { results: true };
  });

  /** Update with the last data */
  params = [sharedImeiId, imei];
  sql =
    'UPDATE device as T1 JOIN device as T2 ON T1.clonedImei = T2.imei SET T1.lastPositionUTC = T2.lastPositionUTC, T1.lat = T2.lat, T1.lng = T2.lng, T1.speed = T2.speed, T1.directionAngle = T2.directionAngle, T1.gsmSignal = T2.gsmSignal, T1.batteryLevel = T2.batteryLevel, T1.lastVisibilityUTC = T2.lastVisibilityUTC WHERE T1.imei = ? AND T1.clonedImei = ?;';
  await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    if (response?.error) printMessage('Error updating device with last data ' + response.error);
  });

  /** Return results */
  return addShareDeviceResult;
};

export { addShareDevice };

interface AddShareDeviceProps {
  (imei: string, userId: string, sharedImeiId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<AddShareDeviceResult>;
}
