import { ConnectionConfig } from 'mysql';
import { DeviceOwnerStates } from '../../enums/DeviceOwnerStates';
import { GetDeviceOwnerStateResult } from '../models/GetDeviceWonerStateResult';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { mySqlNullToEmptyString } from './functions/mySqlNullToEmptyString';
import mySqlQueryAsync from './functions/mySqlQueryAsync';

const connectionConfig: ConnectionConfig = mySqlConnectionConfig;

const getDeviceOwnerState: GetDeviceOwnerStateProps = async (imei) => {
  const params: any[] = [imei];
  const sql: string = `SELECT userId, clonedImei, verificationCode FROM device 
                            LEFT JOIN shared_codes on device.imei = shared_codes.imei 
                            where device.imei = ? 
                            LIMIT 1;`;
  /** Execute query */
  const getDeviceOwnerStateResult: GetDeviceOwnerStateResult = await mySqlQueryAsync(connectionConfig, sql, params).then((response) => {
    /** Check for errors */
    if (response.error) return { state: DeviceOwnerStates.error, userAssigned: '', verificationCode: '', isCloned: false, clonedImei: '' };

    /** Return results */
    if ((response.results?.length ?? 0) === 0)
      return { state: DeviceOwnerStates.notfound, userAssigned: '', verificationCode: '', isCloned: false, clonedImei: '' };

    const userAssigned = mySqlNullToEmptyString(response.results[0]?.userId);
    const clonedImei = mySqlNullToEmptyString(response.results[0]?.clonedImei);
    const isCloned = clonedImei !== '';
    const verificationCode = mySqlNullToEmptyString(response.results[0]?.verificationCode);
    const state = userAssigned === '' ? DeviceOwnerStates.available : DeviceOwnerStates.assigned;

    return { userAssigned, verificationCode, isCloned, state, clonedImei };
  });
  return getDeviceOwnerStateResult;
};

export { getDeviceOwnerState };

interface GetDeviceOwnerStateProps {
  (imei: string): Promise<GetDeviceOwnerStateResult>;
}
