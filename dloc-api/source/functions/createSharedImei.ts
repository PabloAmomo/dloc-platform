import * as crypto from 'crypto';

const createSharedImei = (imei: string, email: string) => {
  const sharedImeiName = `${imei.toLocaleLowerCase()}_shared_${email.toLocaleLowerCase()}`;
  const sharedImeiId = 'S' + crypto.createHash('shake256', { outputLength: 7 }).update(sharedImeiName).digest('hex');
  return sharedImeiId;
}

export { createSharedImei };