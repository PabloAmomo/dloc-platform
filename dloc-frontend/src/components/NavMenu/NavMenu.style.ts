import { SxProps } from '@mui/material';

const NavMenuStyle = {
  ContainerProps: {
    sx: { display: 'flex', width: '100%', height: '100%' } as SxProps,
  },

  LogoContainerProps: {
    sx: { pl: 1, pt: '8px', cursor: 'pointer' } as SxProps,
  },
  LogoSize: 48 as number,

  AppTitleContainerProps: {
    sx: { pl: 1, pt: 1, display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'left',cursor: 'pointer' } as SxProps,
  },
  AvatarContainerProps: {
    sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', pr: 3 } as SxProps,
  },
  SideMenuContainerProps: {
    sx: { display: 'flex', justifyContent: 'center', alignItems: 'center', pr: 1 } as SxProps,
  },
};

export default NavMenuStyle;
