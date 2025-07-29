import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from 'providers/UserProvider';
import AppTitle from 'components/AppTitle/AppTitle';
import LanguageSelector from 'components/LanguageSelector/LanguageSelector';
import Logo from 'components/Logo/Logo';
import SideMenu from 'components/SideMenu/SideMenu';
import style from './NavMenu.style';
import UserAvatar from 'components/UserAvatar/UserAvatar';

const NavMenu = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const isValidated = user.token !== '';

  const clickGoHome = () => navigate('/home');

  return (
    <Box {...style.ContainerProps}>
      <Grid container>
        {/* Logo */}
        <Grid onClick={clickGoHome} item>
          <Box {...style.LogoContainerProps}>
            <Logo size={style.LogoSize} />
          </Box>
        </Grid>
        
        {/* AppTitle */}
        <Grid onClick={clickGoHome} item {...style.AppTitleContainerProps}>
          <AppTitle />
        </Grid>
        
        <Grid item flexGrow={'1'}></Grid>
        
        {/* UserAvatar */}
        {isValidated && (
          <Grid item {...style.AvatarContainerProps}>
            <UserAvatar />
          </Grid>
        )}

        {/* SideMenu (LanguageSelector or MenuIcon) */}
        <Grid item {...style.SideMenuContainerProps}>
          {isValidated ? <SideMenu /> : <LanguageSelector />}
        </Grid>
      </Grid>
    </Box>
  );
};

export default NavMenu;
