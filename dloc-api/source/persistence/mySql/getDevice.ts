import { ConnectionConfig } from 'mysql';
import { Device } from '../entities/Device';
import { DeviceParams } from '../entities/DeviceParams';
import { DeviceUser } from '../entities/DeviceUser';
import { EncriptedData } from '../../models/EncriptedData';
import { EncriptionHelper } from '../../models/EncriptionHelper';
import { GetDeviceResult } from '../models/GetDeviceResult';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { mySqlNullToEmptyString } from './functions/mySqlNullToEmptyString';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevice: GetDeviceProps = async (imei, userId, encription) => {
  const params: any[] = [imei, userId];

  const sql = `SELECT imei, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, lastPositionUTC, lastVisibilityUTC, params, clonedImei
               FROM device 
               WHERE imei = ? and userId = ? 
               LIMIT 1;`;

  /** Execute query */
  const response: GetDeviceResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { error: response.error, results: [] };
    
    response.results = response.results.map((result: Device): DeviceUser => {
      /** Decrypt params */
      const encriptedData : EncriptedData = JSON.parse(result.params);
      const decriptedData : DeviceParams | undefined = encription.decryptDeviceParams(encriptedData, userId);
      result.params = JSON.stringify(decriptedData ?? {});
      /* Check if the device is shared */
      const isShared = mySqlNullToEmptyString(result?.clonedImei) !== '';
      delete result.clonedImei;
      /** Return result */
      return { ...result, isShared };
    });

    /** Return results */
    return { results: response?.results ?? [] };
  });
  return response;
};

export { getDevice };

interface GetDeviceProps {
  (imei: string, userId: string, encription: EncriptionHelper): Promise<GetDeviceResult>;
}
