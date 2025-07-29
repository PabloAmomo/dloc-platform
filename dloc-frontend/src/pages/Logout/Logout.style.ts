import { SxProps } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

const LogoutStyle = {
  ContainerProps: {
    sx: {
      justifyContent: 'center',
      alignItems: 'center',
    } as SxProps,
  },
  LogeedOutMessageContainerProps: {
    sx: {
      textAlign: 'center',
      pt: 2,
    } as SxProps,
  },
  LogeedOutMessageTextProps: {
    variant: 'h4' as Variant,
    sx: { pb: 4 } as SxProps,
  }
};

export default LogoutStyle;
