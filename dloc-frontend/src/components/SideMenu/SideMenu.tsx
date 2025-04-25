import { Box, Divider, Drawer, IconButton, List, ListItem } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Device } from 'models/Device';
import { useDevicesFormContext } from 'providers/DeviceFormProvider';
import { useState } from 'react';
import { useUserContext } from 'providers/UserProvider';
import LanguageSelector from 'components/LanguageSelector/LanguageSelector';
import LogoutDialog from 'components/LogoutDialog/LogoutDialog';
import MenuIcon from '@mui/icons-material/Menu';
import SideMenuDevices from 'components/SideMenuDevices/SideMenuDevices';
import SideMenuUser from 'components/SideMenuUser/SideMenuUser';
import style from './SideMenu.style';

const SideMenu = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const { isLoggedIn } = useUserContext();
  const { openFormDevice } = useDevicesFormContext();

  const onClose = () => setSideMenuOpen(false);
  const toggleOpenState = () => setSideMenuOpen(!sideMenuOpen);
  const clickOnDevice = (device: Device | undefined) => openFormDevice(device);
  const clickOnLogout = () => setOpenDialog(true);

  return (
    <>
      <LogoutDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />

      <IconButton onClick={toggleOpenState} {...style.MenuIconProps}>
        <MenuIcon />
      </IconButton>

      <Drawer open={sideMenuOpen} onClose={onClose} {...style.DrawerProps}>
        <Box {...style.MenuContainerProps} onClick={onClose}>
          <Box {...style.MenuCloseButtonContainer}>
            <IconButton {...style.MenuCloseButton} onClick={onClose}>
              <Close />
            </IconButton>
          </Box>

          <List disablePadding>
            <ListItem>
              <LanguageSelector />
            </ListItem>
          </List>
          <Divider />

          {isLoggedIn && (
            <>
              <SideMenuDevices clickOnDevice={clickOnDevice} />
              <SideMenuUser clickOnLogout={clickOnLogout} />
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default SideMenu;
