import { closeSnackbar } from 'notistack';
import { NonOAuthError, TokenResponse, useGoogleLogin } from '@react-oauth/google';
import { User } from 'models/User';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import {logError} from 'functions/logError';
import BrandLoginButton from 'components/BrandLoginButton/BrandLoginButton';
import getGoogleProfileInfoService from 'services/getGoogleProfileInfo/getGoogleProfileInfo';
import showAlert from 'functions/showAlert';

const LoginButtonGoogle = () => {
  const { setUser, setIsLogingIn: setIsLoging, isLogingIn: isLoging, close } = useUserContext();
  const { t } = useTranslation();

  const handleOnClick = () => {
    if (isLoging) return;

    closeSnackbar();
    
    setIsLoging(true);
    googleLogin();
  };
  
  /** Google Login */
  const googleLogin = useGoogleLogin({

    /** Google Login Success */
    onSuccess: (googleResponse: TokenResponse) => {
      const { access_token } = googleResponse;

      if (!access_token) {
        showAlert(t('errors.invalidLoginGoogle'), 'error');
        return;
      }

      /** Get Google Profile Info */
      getGoogleProfileInfoService({
        access_token,
        onSuccess: (user: User) => setUser(user),
        onError: (error: Error) => showAlert(t('errors.invalidLoginGoogle'), 'error'),
      });
    },

    /** Google Login Error */
    onError: () => showAlert(t('errors.invalidLoginGoogle'), 'error'),

    /** Google Login Canceled */
    onNonOAuthError: (nonOAuthError: NonOAuthError) => {
      showAlert(`${t('errors.noLoginGoogle')}`, 'error');
      close();
      logError(nonOAuthError.type);
    },
  });

  /** Render */
  return <BrandLoginButton onClick={handleOnClick} brand="google" />;
};

export default LoginButtonGoogle;