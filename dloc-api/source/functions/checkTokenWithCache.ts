import { AuthProviders } from '../enums/AuthProviders';
import { EncriptedData } from '../models/EncriptedData';
import { Persistence } from '../persistence/_Persistence';
import { UserData } from '../models/UserData';
import { EncriptionHelper } from '../models/EncriptionHelper';

const checkTokenWithCache : checkTokenWithCacheProps = async (authProvider, tokenId, password, persistence, encription): Promise<UserData> => {
  /* Unknown provider, return empty */
  if (authProvider === AuthProviders.unknown) return { userId: '', email: '' };

  /* Check if token is in cache and return from */
  const cacheGetTokenResult = await persistence.cacheGetTokenData(tokenId);

  /* Token in cache, prepare data and return */
  if (cacheGetTokenResult.result !== '') {
    /* Decrypt data */
    const encriptedObject: EncriptedData = JSON.parse(cacheGetTokenResult.result);
    const decriptedData: any = JSON.parse(encription.decrypt(encriptedObject, password) ?? '{}');
    const { userId, email } = decriptedData;
    return { userId, email };
  }

  /* Not in cache, return empty */
  return { userId: '', email: '' };
};

export { checkTokenWithCache };

interface checkTokenWithCacheProps {
  (authProvider: string, tokenId: string, password: string, persistence: Persistence, encription: EncriptionHelper): Promise<UserData>;
}
