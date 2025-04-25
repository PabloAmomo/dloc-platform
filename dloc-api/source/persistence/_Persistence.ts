import { AddDeviceResult } from './models/AddDeviceResult';
import { AddShareDeviceCodeResult } from './models/AddShareDeviceCodeResult';
import { AddShareDeviceResult } from './models/AddShareDeviceResult';
import { CacheAddTokenResult } from './models/CacheAddTokenResult';
import { CacheGetTokenDataResult } from './models/CacheGetTokenDataResult';
import { DeleteDeviceResult } from './models/DeleteDeviceResult';
import { DeleteShareDeviceCodeResult } from './models/DeleteShareDeviceCodeResult';
import { DeleteShareDeviceResult } from './models/DeleteShareDeviceResult';
import { DeviceParams } from './entities/DeviceParams';
import { GetDeviceOwnerStateResult } from './models/GetDeviceWonerStateResult';
import { GetDeviceParamsResult } from './models/GetDeviceParamsResult';
import { GetDeviceResult } from './models/GetDeviceResult';
import { GetDevicesResult } from './models/GetDevicesResult';
import { PersistenceResult } from './models/PersistenceResult';
import { SaveDeviceParamsResult } from './models/SaveDeviceParamsResult';
import { EncriptionHelper } from '../models/EncriptionHelper';

export interface Persistence {
  addDevice: addDevice;
  addShareDevice: addShareDevice;
  addShareDeviceCode: addShareDeviceCode;
  cacheAddToken: cacheAddToken;
  cacheGetTokenData: cacheGetTokenData;
  cacheRemoveToken: cacheRemoveToken;
  deleteDevice: deleteDevice;
  deleteShareDevice: deleteShareDevice;
  deleteShareDeviceCode: deleteShareDeviceCode;
  getDevice: getDevice;
  getDeviceOwnerState: getDeviceOwnerState;
  getDeviceParams: getDeviceParams;
  getDevices: getDevices;
  getDevicesDataSign: getDevicesDataSign;
  getPersistenceConfig: getPersistenceConfig;
  getPersistenceName: getPersistenceName;
  health: health;
  isDeviceOwner: isDeviceOwner;
  saveDeviceParams: saveDeviceParams;
}

export interface getPersistenceName {
  (): string;
}

export interface getPersistenceConfig {
  (): string;
}

export interface saveDeviceParams {
  (imei: string, userId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<SaveDeviceParamsResult>;
}

export interface isDeviceOwner {
  (imei: string, userId: string): Promise<boolean>;
}

export interface getDeviceOwnerState {
  (imei: string): Promise<GetDeviceOwnerStateResult>;
}

export interface getDeviceParams {
  (imei: string, userId: string, encription: EncriptionHelper): Promise<GetDeviceParamsResult>;
}

export interface addShareDeviceCode {
  (imei: string, verificationCode: string): Promise<AddShareDeviceCodeResult>;
}

export interface addShareDevice {
  (imei: string, userId: string, sharedImeiId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<AddShareDeviceResult>;
}

export interface deleteShareDevice {
  (imei: string, sharedImeiId: string): Promise<DeleteShareDeviceResult>;
}

export interface deleteShareDeviceCode {
  (sharedImeiId: string): Promise<DeleteShareDeviceCodeResult>;
}

export interface cacheRemoveToken {
  (tokenId: string): Promise<void>;
}

export interface cacheGetTokenData {
  (tokenId: string): Promise<CacheGetTokenDataResult>;
}

export interface cacheAddToken {
  (tokenId: string, data: string): Promise<CacheAddTokenResult>;
}

export interface getDevice {
  (imei: string, userId: string, encription: EncriptionHelper): Promise<GetDeviceResult>;
}
export interface getDevices {
  (userId: string, interval: number, encription: EncriptionHelper): Promise<GetDevicesResult>;
}

export interface addDevice {
  (imei: string, userId: string, deviceParams: DeviceParams, encription: EncriptionHelper): Promise<AddDeviceResult>;
}

export interface deleteDevice {
  (imei: string, userId: string): Promise<DeleteDeviceResult>;
}

export interface health {
  (): Promise<PersistenceResult>;
}

export interface getDevicesDataSign {
  (userId: string): Promise<string>;
}