import { AuthProviders } from '../enums/AuthProviders';
import { UserData } from '../models/UserData';

const checkTokenWithProvider = async (props: checkTokenWithProviderProps): Promise<UserData> => {
  const { authProvider, token, saveTokenInCache, authValidators } = props;

  /* Validate token */
  const userDataInToken = (await authValidators.find((authValidator) => authValidator.name == authProvider)?.validate(token)) ?? {
    error: '',
    userData: { userId: '', email: '' },
    tokenData: {},
  };

  /* set user data */
  const userData = userDataInToken?.userData ?? { userId: '', email: '' };

  /* Save token in cache */
  if (userData?.userId) await saveTokenInCache(userDataInToken.tokenData);

  /* Return user data */
  return userData;
};

export { checkTokenWithProvider };

export interface checkTokenWithProviderProps {
  authProvider: AuthProviders;
  token: string;
  saveTokenInCache: any;
  authValidators: AuthValidator[];
}

export interface ValidateTokeReponse {
  error: string;
  userData: UserData;
  tokenData: any;
}

export interface AuthValidator {
  name: AuthProviders;
  validate: (token: string) => Promise<ValidateTokeReponse>;
}
