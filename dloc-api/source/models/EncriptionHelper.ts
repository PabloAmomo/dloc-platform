import { DeviceParams } from '../persistence/entities/DeviceParams';
import { EncriptedData } from './EncriptedData';
import { EncriptionBase } from './Encription';

export interface EncriptionHelper extends EncriptionBase {
  encrypt: (plainData: string, userId: string) => EncriptedData | undefined;
  decrypt: (encryptedData: EncriptedData, userId: string) => string | undefined;
  
  encryptDeviceParams: (deviceParams: DeviceParams, userId: string) => EncriptedData | undefined;
  decryptDeviceParams: (encryptedData: EncriptedData, userId: string) => DeviceParams | undefined;
}
