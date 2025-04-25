import { addDevice } from './addDevice';
import { AddDeviceResult } from '../models/AddDeviceResult';
import { addShareDevice } from './addShareDevice';
import { addShareDeviceCode } from './addShareDeviceCode';
import { AddShareDeviceCodeResult } from '../models/AddShareDeviceCodeResult';
import { AddShareDeviceResult } from '../models/AddShareDeviceResult';
import { cacheAddToken } from './cacheAddToken';
import { CacheAddTokenResult } from '../models/CacheAddTokenResult';
import { cacheGetTokenData } from './cacheGetTokenData';
import { CacheGetTokenDataResult } from '../models/CacheGetTokenDataResult';
import { cacheRemoveToken } from './cacheRemoveToken';
import { deleteDevice } from './deleteDevice';
import { DeleteDeviceResult } from '../models/DeleteDeviceResult';
import { deleteShareDevice } from './deleteShareDevice';
import { deleteShareDeviceCode } from './deleteShareDeviceCode';
import { DeleteShareDeviceCodeResult } from '../models/DeleteShareDeviceCodeResult';
import { DeleteShareDeviceResult } from '../models/DeleteShareDeviceResult';
import { DeviceParams } from '../entities/DeviceParams';
import { EncriptionHelper } from '../../models/EncriptionHelper';
import { getDevice } from './getDevice';
import { getDeviceOwnerState } from './getDeviceOwnerState';
import { GetDeviceOwnerStateResult } from '../models/GetDeviceWonerStateResult';
import { getDeviceParams } from './getDeviceParams';
import { GetDeviceParamsResult } from '../models/GetDeviceParamsResult';
import { GetDeviceResult } from '../models/GetDeviceResult';
import { getDevices } from './getDevices';
import { getDevicesDataSign } from './getDevicesDataSign';
import { GetDevicesResult } from '../models/GetDevicesResult';
import { getHealth } from './getHealth';
import { isDeviceOwner } from './isDeviceOwner';
import { mySqlConnectionConfig } from './functions/mySqlConnectionConfig';
import { Persistence } from '../_Persistence';
import { PersistenceResult } from '../models/PersistenceResult';
import { saveDeviceParams } from './saveDeviceParams';
import { SaveDeviceParamsResult } from '../models/SaveDeviceParamsResult';

class mySqlPersistence implements Persistence {
  getPersistenceName(): string {
    return 'My SQL Server';
  }
  
  saveDeviceParams(imei: string, userId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<SaveDeviceParamsResult> {
    return saveDeviceParams(imei, userId, deviceParams, encription);
  }

  isDeviceOwner(imei: string, userId: string): Promise<boolean> {
    return isDeviceOwner(imei, userId);
  }

  getDeviceOwnerState(imei: string): Promise<GetDeviceOwnerStateResult> {
    return getDeviceOwnerState(imei);
  }

  deleteShareDeviceCode(imei: string): Promise<DeleteShareDeviceCodeResult> {
    return deleteShareDeviceCode(imei);
  }

  getDeviceParams(imei: string, userId: string, encription: EncriptionHelper): Promise<GetDeviceParamsResult> {
    return getDeviceParams(imei, userId, encription);
  }

  deleteShareDevice(imei: string, sharedImeiId: string): Promise<DeleteShareDeviceResult> {
    return deleteShareDevice(imei, sharedImeiId);
  }

  addShareDeviceCode(imei: string, verificationCode: string): Promise<AddShareDeviceCodeResult> {
    return addShareDeviceCode(imei, verificationCode);
  }

  addShareDevice(imei: string, userId: string, sharedImeiId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<AddShareDeviceResult> {
    return addShareDevice(imei, userId, sharedImeiId, deviceParams, encription);
  }

  getPersistenceConfig(): string {  
    const { host, user, database, port, password } = mySqlConnectionConfig;
    return `host: ${host}, user: ${user}, database: ${database}, port: ${port}, password: ${password?.substring(0,3)}*********`;
  }

  getDevicesDataSign(userId: string): Promise<string> {
    return getDevicesDataSign(userId);
  } 

  cacheRemoveToken(tokenId: string): Promise<void> {
    return cacheRemoveToken(tokenId);
  }

  cacheGetTokenData(tokenId: string): Promise<CacheGetTokenDataResult> {
    return cacheGetTokenData(tokenId);
  }

  cacheAddToken(tokenId: string, data: string): Promise<CacheAddTokenResult> {
    return cacheAddToken(tokenId, data);
  }

  addDevice(imei: string, userId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<AddDeviceResult> {
    return addDevice(imei, userId, deviceParams, encription);
  }

  deleteDevice(imei: string, userId: string): Promise<DeleteDeviceResult> {
    return deleteDevice(imei, userId);
  }

  getDevice(imei: string, userId: string, encription: EncriptionHelper): Promise<GetDeviceResult> {
    return getDevice(imei, userId, encription);
  }

  getDevices(userId: string, interval: number, encription: EncriptionHelper): Promise<GetDevicesResult> {
    return getDevices(userId, interval, encription);
  }

  health(): Promise<PersistenceResult> {
    return getHealth();
  }
}

export { mySqlPersistence };
