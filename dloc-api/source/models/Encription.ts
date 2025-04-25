import { EncriptedData } from "./EncriptedData";

export interface Encription extends EncriptionBase {
  decrypt: (encryptedData: EncriptedData, password: string) => string | undefined;
  encrypt: (plainData: string, password: string) => EncriptedData | undefined;
}

export interface EncriptionBase {
  getAlgoritmName: () => string;
  createHashMD5: (text: string) => string;
  createTokenId: (authProvider: string, token: string) => string;
  createTokenPassword: (token: string) => string;
  crateUserPassword: (userId: string) => string;
}

