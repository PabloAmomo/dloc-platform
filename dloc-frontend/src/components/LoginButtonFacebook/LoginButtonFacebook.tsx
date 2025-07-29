import { AuthProviders } from 'enums/AuthProviders';
import { closeSnackbar } from 'notistack';
import { Colors } from 'enums/Colors';
import { configApp } from 'config/configApp';
import { IconType } from 'enums/IconType';
import { logError } from 'functions/logError';
import { User } from 'models/User';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import BrandLoginButton from 'components/BrandLoginButton/BrandLoginButton';
import FacebookLogin, { FailResponse, ProfileSuccessResponse, SuccessResponse } from '@greatsumini/react-facebook-login';
import showAlert from 'functions/showAlert';

const appId = configApp.facebookAuth0AppId;

const LoginButtonFacebook = () => {
  const { setUser, setIsLogingIn: setIsLoging, isLogingIn, close } = useUserContext();
  const { t } = useTranslation();
  const loginResponseValue = useRef<SuccessResponse | null>(null);
  const timeout = useRef<number>(0);

  /** Handle On Profile Success */
  const handleOnProfileSuccess = (profileResponse: ProfileSuccessResponse) => {
    if (timeout.current) clearTimeout(timeout.current);

    setIsLoging(false);

    if (!loginResponseValue.current || !profileResponse) return showAlert(t('errors.invalidLogiFacebook'), 'error');

    const { accessToken: token, userID } = loginResponseValue.current;
    const { id, name, email, picture } = profileResponse;
    const user: User = {
      authProvider: AuthProviders.facebook,
      token,
      profile: { id: userID ?? id, name: name ?? '', email: email ?? '', image: picture?.data.url ?? '', iconOnMap: IconType.pulse, iconColor: Colors.green },
      devices: {},
    };
    setUser(user);
  };

  /** Handle On Success */
  const handleOnSuccess = (loginResponse: SuccessResponse) => (loginResponseValue.current = loginResponse);

  /** Handle On Fail */
  const handleOnFail = (failResponse: FailResponse | { status: 'timeout' }) => {
    if (timeout.current) clearTimeout(timeout.current);
    setIsLoging(false);
    loginResponseValue.current = null;
    close();
    showAlert(t('errors.invalidLogiFacebook'), 'error');
    logError(`Facebook Login Error: ${failResponse.status}`);
  };

  /** Handle On Click */
  const handleOnClick = (onClick: any) => {
    if (isLogingIn) return;

    closeSnackbar();

    setIsLoging(true);

    /** 10 second to get facebook profile */
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => handleOnFail({ status: 'timeout' }), 10000);
    
    onClick && onClick();
  };

  /** Render */
  return (
    <FacebookLogin
      appId={appId}
      autoLoad={false}
      fields="name,email,picture"
      onProfileSuccess={handleOnProfileSuccess}
      onSuccess={handleOnSuccess}
      onFail={handleOnFail}
      render={({ onClick }) => <BrandLoginButton onClick={() => handleOnClick(onClick)} brand="facebook" />}
    />
  );
};

export default LoginButtonFacebook;
