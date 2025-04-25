import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import LogoutDialog from 'components/LogoutDialog/LogoutDialog';
import PageContainer from 'components/PageContainer/PageContainer';
import style from './Logout.style';

const Logout = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const { logout, isLoggedIn } = useUserContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const forced = searchParams.get('forced') === 'true';

  useEffect(() => {
    if (!forced && !window.location.pathname.toLowerCase().endsWith('/forced')) setOpenDialog(true);
    else logout();
  }, []);

  const onCancel = () => navigate(-1);

  const onGotoLogin = () => navigate('/login');

  if (forced) return <></>;
  return (
    <PageContainer {...style.ContainerProps}>
      {isLoggedIn ? (
        <LogoutDialog openDialog={openDialog} setOpenDialog={setOpenDialog} onCancel={onCancel} />
      ) : (
        <Box {...style.LogeedOutMessageContainerProps}>
          <Typography {...style.LogeedOutMessageTextProps}>{t('alreadyLogout')}</Typography>
          <Button onClick={onGotoLogin} variant="contained" color="primary">
            {t('gotoLogin')}
          </Button>
        </Box>
      )}
    </PageContainer>
  );
};

export default Logout;
