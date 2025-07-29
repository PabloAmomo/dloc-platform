import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import NavMenu from 'components/NavMenu/NavMenu';
import style from './Layout.style';

function Layout() {
  return (
    <>
      {/* Menu TOP */}
      <Box {...style.MenuTopProps}>
        <NavMenu />
      </Box>

      {/* Page content */}
      <Outlet />

      {/* Alert Messages */}
      <SnackbarProvider maxSnack={3} />
    </>
  );
}

export default Layout;
