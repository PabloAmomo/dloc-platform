import { SxProps } from '@mui/material';
import { Colors } from 'enums/Colors';

const LoginStyle = {
  ContainerProps: { sx: { bottom: 0 } as SxProps },
  ContactUseProps: { sx: { display: 'flex', justifyContent: 'center', cursor: 'pointer', mb: 2 } as SxProps },
  ShowInstructionsProps: { sx: { display: 'flex', justifyContent: 'center', cursor: 'pointer', mt: 1, mb: 1 } as SxProps },
  LoginButtonProps: { sx: { display: 'flex', justifyContent: 'center' } as SxProps },
  GridContainerProps: { spacing: 2, alignItems: 'center', sx: { mt: 0, maxHeight: '640px' } },
  titleProps: (sx: SxProps) => ({
    fontFamily: 'arial',
    color: Colors.white,
    variant: 'h4',
    textAlign: 'center',
    sx: { textShadow: '2px 2px #00000030', userSelect: 'none', display: 'flex', flexDirection: 'column', pl: 1, pr: 1, ...sx } as SxProps,
  }),
  SloganProps: {
    sx: { fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.4rem' } } as SxProps,
  },
  CarrouselContainerProps: {
    sx: { pt: '0!important', height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' } as SxProps,
  },
  MainContainerProps: {
    sx: {
      width: '100vw',
      height: '100%',
      display: 'flex',
      // Background image
      backgroundImage: 'url("images/login-background.webp")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      // Sup border
      ':before': {
        content: "''",
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: '100vh',
        height: '40vh',
        top: 'var(--top-menu-height)',
        background: '#607d8b',
        borderRadius: '50%',
        transformOrigin: 'bottom',
        transform: 'translateX(-50%) scale(4)',
        zIndex: -1,
      },
      ':after': {
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'var(--top-menu-height)',
        background: Colors.white,
        transform: 'translateY(-100%)',
        zIndex: 0,
      },
    } as SxProps,
  },

  LinkButtonProps: {
    sx: {
      borderRadius: '8px',
      backgroundColor: '#0000003b',
      padding: '8px',
      width: '34ch',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '100',
      '&:hover': { backgroundColor: '#ffffff3b' },
    } as SxProps,
  },
};

export default LoginStyle;
