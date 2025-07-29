import { AuthProviders } from 'enums/AuthProviders';
import { closeSnackbar } from 'notistack';
import { Colors } from 'enums/Colors';
import { configApp } from 'config/configApp';
import { IconType } from 'enums/IconType';
import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';
import { useEffect, useState } from 'react';
import { User } from 'models/User';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import {logError} from 'functions/logError';
import BrandLoginButton from 'components/BrandLoginButton/BrandLoginButton';
import showAlert from 'functions/showAlert';

/** Microsoft Login Configuration */
const redirectUri = `${window.location.origin}/auth`;
const clientId = configApp.microsoftAuth0ClientId;
const authority = configApp.microsoftProfileUrl;
const msalInstance = new PublicClientApplication({ auth: { clientId, redirectUri, authority }, cache: { cacheLocation: 'localStorage' } } as Configuration);

const LoginButtonMicrosoft = () => {
  const [microsoftReady, setMicrosoftReady] = useState(false);
  const { setUser, setIsLogingIn: setIsLoging, isLogingIn, close } = useUserContext();
  const { t } = useTranslation();

  useEffect(() => {
    /** Initialize Microsoft Login Button */
    msalInstance.initialize().then(() => setMicrosoftReady(true));
  }, []);

  /** Microsoft Login */
  const handleOnClick = async () => {
    if (isLogingIn) return;

    closeSnackbar();

    setIsLoging(true);

    try {
      /** Open login Popup */
      const loginResponse: AuthenticationResult = await msalInstance.loginPopup({ scopes: ['openid', 'profile', 'email'] });

      const {
        account: { name = '', username: email, homeAccountId: id },
        idToken: token,
      } = loginResponse;

      /** Complete User Info */
      const user: User = {
        authProvider: AuthProviders.microsoft,
        token,
        profile: { id, name, email, image: '', iconOnMap: IconType.pulse, iconColor: Colors.green },
        devices: {},
      };

      /** Set User */
      setUser(user);
      //
    } catch (error: any) {
      showAlert(t('errors.invalidLoginMicrosoft'), 'error'), close();
      logError('Microsoft Login Error', error);
      //
    } finally {
      setIsLoging(false);
    }
  };

  /** Render */
  return <BrandLoginButton disabled={!microsoftReady} onClick={handleOnClick} brand="microsoft" />;
};

export default LoginButtonMicrosoft;
