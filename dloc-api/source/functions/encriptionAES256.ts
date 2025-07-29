import { createCipheriv, randomBytes, createHash, createDecipheriv } from 'crypto';
import { EncriptedData } from '../models/EncriptedData';
import { Encription } from '../models/Encription';

class EncriptionAES256 implements Encription {
  decrypt (encryptedData: EncriptedData, password: string) {
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(password), Buffer.from(encryptedData.iv, 'hex'));
    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };

  encrypt (plainData: string, password: string): EncriptedData {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(password), iv);
    let encrypted = cipher.update(plainData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
  };

  createHashMD5 (text: string): string { return createHash('md5').update(text).digest('hex'); }

  createTokenId (authProvider: string, token: string): string { return this.createHashMD5(`${authProvider}-${token}`); }

  createTokenPassword (token: string): string { return this.createHashMD5(`${token}`); }

  crateUserPassword (userId: string): string { return this.createHashMD5(`${userId}`); }

  getAlgoritmName (): string { return 'AES256'; }
}

const encriptionAES256 = new EncriptionAES256();

export { encriptionAES256 };


