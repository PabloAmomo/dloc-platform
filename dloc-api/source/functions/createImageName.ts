import * as crypto from 'crypto';

const createImageName = (imei: string): string => {
  return crypto.createHash('sha256').update(imei).digest('hex');
}

export { createImageName };