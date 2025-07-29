import { AuthProviders } from '../enums/AuthProviders';
import { AuthValidator, checkTokenWithProvider } from './checkTokenWithProvider';
import { CacheAddTokenResult } from '../persistence/models/CacheAddTokenResult';
import { checkTokenWithCache } from './checkTokenWithCache';
import { EncriptionHelper } from '../models/EncriptionHelper';
import { Persistence } from '../persistence/_Persistence';
import { printMessage } from './printMessage';
import { UserData } from '../models/UserData';
import { validateAzureB2CToken } from './validateAzureB2CToken';
import { validateFacebookToken } from './validateFacebookToken';
import { validateGoogleToken } from './validateGoogleToken';

const authValidators: AuthValidator[] = [
  { name: AuthProviders.google, validate: async (token: string) => await validateGoogleToken(token) },
  { name: AuthProviders.microsoft, validate: async (token: string) => await validateAzureB2CToken(token) },
  { name: AuthProviders.facebook, validate: async (token: string) => await validateFacebookToken(token) },
];

const checkToken = async (props: checkTokenProps): Promise<UserData> => {
  const { token, authProvider, persistence, encription } = props;

  /* Create token id and password */
  const tokenId = encription.createTokenId(authProvider, token);
  const password = encription.createTokenPassword(token);

  /* Check if token is in cache and return from */
  const responseCheckTokenWithCache: UserData = await checkTokenWithCache(authProvider, tokenId, password, persistence, encription);
  if (responseCheckTokenWithCache.userId !== '') return responseCheckTokenWithCache;

  /* INJECTION: Save token in cache */
  const saveTokenInCache = async (userData: any): Promise<void> => {
    const cacheAddTokenResult: CacheAddTokenResult = await persistence.cacheAddToken(
      tokenId,
      JSON.stringify(encription.encrypt(JSON.stringify(userData), password))
    );
    if (cacheAddTokenResult.results === false) printMessage(`Error saving token in cache: ${cacheAddTokenResult.error}`); 
  };

  /* Not in cache, check with auth provider */
  return await checkTokenWithProvider({ authProvider, token, saveTokenInCache, authValidators });
};

export { checkToken };

interface checkTokenProps {
  authProvider: AuthProviders;
  persistence: Persistence;
  encription: EncriptionHelper;
  token: string;
}
