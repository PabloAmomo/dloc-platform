import { ConnectionConfig } from 'mysql';
import { Device } from '../entities/Device';
import { encriptionHelper } from '../../functions/encriptionHelper';
import { DeviceUser } from '../entities/DeviceUser';
import { elimintateDuplicates } from '../../functions/eliminateDuplicates';
import { GetDevicesResult } from '../models/GetDevicesResult';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { mySqlNullToEmptyString } from './functions/mySqlNullToEmptyString';
import { printMessage } from '../../functions/printMessage';
import mySqlQueryAsync from './functions/mySqlQueryAsync';
import { EncriptionHelper } from '../../models/EncriptionHelper';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDevices: GetDevicesProps = async (userId, interval, encription) => {
  /** Create query */
  const params: any[] = [userId];
  const sql = `SELECT imei, lat, lng, speed, directionAngle, gsmSignal, batteryLevel, 
                      lastPositionUTC, lastVisibilityUTC, params, clonedImei
                FROM device 
                WHERE userId = ?
                ORDER BY imei;`;

  /** Execute query */
  const response: GetDevicesResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    return response.error ? { error: response.error, results: [] } : { results: response?.results ?? [] };
  });

  /** Get positions for each device */
  for (let index = 0; index < response.results.length; index++) {
    const element = response.results[index];
    const imei = element.imei;

    /** Decrypt params */
    try {
      const encriptedParams = JSON.parse(element.params ?? '{}');
      const decriptedParams = encription.decryptDeviceParams(encriptedParams, userId) ?? {};
      element.params = JSON.stringify(decriptedParams);
    } catch (error: any) {
      printMessage(`Error decrypting device params ${error?.message ?? error}`);
      continue;
    }

    /** Check if the device is cloned and remove the field */
    const positionImei = (element as Device)?.clonedImei ?? imei;
    (element as DeviceUser).isShared = mySqlNullToEmptyString((element as Device).clonedImei) !== '';
    delete (element as Device).clonedImei;

    /** Get positions */
    const paramsPositions: any[] = [positionImei, interval];
    const sqlPositions = `SELECT dateTimeUTC, lat, lng, speed, directionAngle, gsmSignal, batteryLevel 
                          FROM \`position\` WHERE imei = ? 
                          ${interval > 1 ? 'AND dateTimeUTC >= DATE_ADD(UTC_TIMESTAMP(), INTERVAL -? MINUTE)' : ''}
                          ORDER BY dateTimeUTC DESC
                          ${interval > 1 ? '' : 'LIMIT 1'}
                          ;`;
    await mySqlQueryAsync(connectionConfig, sqlPositions, paramsPositions).then((response) => {
      /** Check for errors */
      if (response.error) return { error: response.error, results: [] };

      /** Eliminate duplicates in lat lng (Intermediates) */
      response.results = elimintateDuplicates(response.results ?? []);

      /** Return results */
      element.positions = response.results;
    });
  }

  return response;
};

export { getDevices };

interface GetDevicesProps {
  (userId: string, interval: number, encription: EncriptionHelper): Promise<GetDevicesResult>;
}
