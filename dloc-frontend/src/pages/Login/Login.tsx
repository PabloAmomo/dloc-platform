import { Box, CircularProgress, Grid, Link, SxProps, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import PlatformInstructions from 'components/PlatformInstructions/PlatformInstructions';
import IMAGE_LIST from './Login.const';
import LoginButtonFacebook from 'components/LoginButtonFacebook/LoginButtonFacebook';
import LoginButtonGoogle from 'components/LoginButtonGoogle/LoginButtonGoogle';
import LoginButtonMicrosoft from 'components/LoginButtonMicrosoft/LoginButtonMicrosoft';
import PageContainer from 'components/PageContainer/PageContainer';
import PolaroidCarrusel from 'components/PolaroidCarrusel/PolaroidCarrusel';
import style from './Login.style';

const Login = () => {
  const [isConfigInstructionsOpen, setIsConfigInstructionsOpen] = useState(false);
  const { t } = useTranslation();
  const { user, isLogingIn, isLoggedIn } = useUserContext();
  const navigate = useNavigate();

  const checkIfLoggedIn = () => {
    if (!isLoggedIn) return;

    let redirect = new URLSearchParams(window.location.search).get('redirect') ?? '/';
    if (redirect) {
      try {
        if (redirect.startsWith('b64:')) redirect = atob(redirect.slice(4));
      } catch (e) {
        redirect = '/';
      }
    }
    navigate(redirect);
  };

  useEffect(() => checkIfLoggedIn(), [user]);
  useEffect(() => checkIfLoggedIn(), []);

  const clickOnContact = () => {
    if (!isLogingIn) navigate('/contact');
  };

  const Title = ({ title, prefix, sx }: { title: string | string[]; prefix?: string; sx?: SxProps }) => (
    <Typography {...(style.titleProps(sx ?? {}) as any)}>
      {Array.isArray(title) ? title.map((line) => <span key={line}>{t(`${prefix}${line}`)}</span>) : <span>{title}</span>}
    </Typography>
  );

  /** Open Config Instructions */
  const clickOnConfig = () => setIsConfigInstructionsOpen(true);

  return (
    <PageContainer {...style.ContainerProps}>
      {/* Config Instructions */}
      <PlatformInstructions isOpen={isConfigInstructionsOpen} setIsOpen={setIsConfigInstructionsOpen} titleKey="howPlatformWork" stepsKey="instructions" preStepKey="" titleImage='images/general/gf-22.jpeg' />

      {/* Main Container */}
      <Box {...style.MainContainerProps}>
        <Grid container {...style.GridContainerProps}>
          <Grid item xs={12}>
            <Title {...style.SloganProps} prefix="brand.sloganL" title={['1', '2']} />
            <Title title={t(`brand.sloganL3`)} />
          </Grid>

          {/* INSTRUCTIONS */}
          <Grid item xs={12} {...style.ShowInstructionsProps}>
            <Link underline="none" color={'white'} variant="body1" {...style.LinkButtonProps} onClick={clickOnConfig}>
              {t('showInstructions')}
            </Link>
          </Grid>

          {/* CONTACT US */}
          <Grid item xs={12} {...style.ContactUseProps}>
            <Link underline="none" color={'white'} variant="body1" {...style.LinkButtonProps} onClick={clickOnContact}>
              {t('contactWithUs')}
            </Link>
          </Grid>

          {/* LOGIN BUTTONS (GOOGLE, MS, ) */}
          <Grid item xs={12} {...style.LoginButtonProps}>
            <LoginButtonGoogle />
          </Grid>
          <Grid item xs={12} {...style.LoginButtonProps}>
            <LoginButtonMicrosoft />
          </Grid>
          <Grid item xs={12} {...style.LoginButtonProps}>
            <LoginButtonFacebook />
          </Grid>

          {/* CARROUSEL */}
          <Grid item xs={12} {...style.CarrouselContainerProps}>
            {isLogingIn ? <CircularProgress /> : <PolaroidCarrusel images={IMAGE_LIST} />}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Login;
