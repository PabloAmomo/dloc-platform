import { MicrosoftUserData } from '../models/MicrosoftUserData';
import { UserData } from '../models/UserData';
import { ValidateTokeReponse } from './checkTokenWithProvider';
import jwksClient from 'jwks-rsa';
import jwt, { VerifyOptions } from 'jsonwebtoken';

const verifyOptions: VerifyOptions = {
  audience: process.env.MICROSOFT_CLIENT_ID,
  issuer: process.env.MICROSOFT_AUTH_ISSUER ?? '',
  algorithms: ['RS256'],
};

const getKey = async (header: any, callback: any) => {
  const client = jwksClient({ jwksUri: process.env.MICROSOFT_AUTH_DISCOVERY_URL ?? '' });

  await client
    .getSigningKey(header.kid)
    .then((key) => callback(null, key.getPublicKey()))
    .catch((err) => callback(err, null));
};

const validateAzureB2CToken = async (token: string): Promise<ValidateTokeReponse> => {
  const tokenData: MicrosoftUserData = { id: '', email: '', name: '', userId: ''};
  const userData: UserData = { userId: '', email: '' };
  let error: any;

  await new Promise((resolve, reject) => {
    jwt.verify(token, getKey, verifyOptions, (err, decoded) => {
      if (err) {
        reject(err);
        return;
      }
      /* Get user data */
      const { oid, email, name } = decoded as any;
      tokenData.id = oid ?? '';
      tokenData.userId = oid ?? '';
      tokenData.email = email ?? '';
      tokenData.name = name ?? '';
      userData.userId = oid ?? '';
      userData.email = email ?? '';
      resolve(userData);
    })
  }).catch((err) => {  error = err; });

  return { error, userData, tokenData };
};

export { validateAzureB2CToken };
