import { DeviceParams } from '../persistence/entities/DeviceParams';
import { EncriptedData } from '../models/EncriptedData';
import { Encription } from '../models/Encription';
import { EncriptionHelper } from '../models/EncriptionHelper';
import { printMessage } from './printMessage';

class EncriptionHelperClass implements EncriptionHelper {
  _encription: Encription;

  constructor(encription: Encription) {
    this._encription = encription;
  }

  encrypt(plainData: string, userId: string): EncriptedData | undefined {
    try {
      const password = this._encription.crateUserPassword(userId);
      return this._encription.encrypt(plainData, password);
    } catch (error: any) {
      printMessage(`Error encrypting ${error?.message ?? error}`);
    }
    return;
  }

  decrypt(encryptedData: EncriptedData, userId: string): string | undefined {
    try {
      const password = this._encription.crateUserPassword(userId);
      const plainData = this._encription.decrypt(encryptedData, password);
      return plainData;
    } catch (error: any) {
      printMessage(`Error decrypting device params ${error?.message ?? error}`);
    }
    return;
  }

  encryptDeviceParams(deviceParams: DeviceParams, userId: string): EncriptedData | undefined {
    return this.encrypt(JSON.stringify(deviceParams), userId);
  }
  decryptDeviceParams(encryptedData: EncriptedData, userId: string): DeviceParams | undefined {
    return JSON.parse(this.decrypt(encryptedData, userId) ?? '{}');
  }

  createHashMD5(text: string): string {
    return this._encription.createHashMD5(text);
  }
  createTokenId(authProvider: string, token: string): string {
    return this._encription.createTokenId(authProvider, token);
  }
  createTokenPassword(token: string): string {
    return this._encription.createTokenPassword(token);
  }
  crateUserPassword(userId: string): string {
    return this._encription.crateUserPassword(userId);
  }
  getAlgoritmName(): string {
    return this._encription.getAlgoritmName();
  }
}

var encriptionHelper: EncriptionHelper;

const setEncriptionHelper = (encription: Encription) => {
  encriptionHelper = new EncriptionHelperClass(encription);
};

export { encriptionHelper, setEncriptionHelper };
