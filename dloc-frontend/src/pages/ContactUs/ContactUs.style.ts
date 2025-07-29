import { Email } from '@mui/icons-material';
import { GridSize, SxProps } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

const ProfileStyle = {
  PageProps: { sx: { bottom: 0, overflow: 'auto' } as SxProps },

  GridItemProps: {
    sx: { display: 'flex', justifyContent: 'center' } as SxProps,
    xs: 12 as GridSize,
  },

  GridContainerProps: { sx: { padding: '1em!important', maxWidth: '480px!important', width: '100%' } as SxProps },

  ButtonActionProps: {
    sx: { width: '16ch' } as SxProps,
    variant: 'text' as 'contained' | 'text' | 'outlined',
    color: 'primary' as 'inherit' | 'primary' | 'error' | 'success' | 'warning' | 'info' | 'secondary',
  },

  TextFieldProps: { sx: { width: '100%', mt: 1 } as SxProps, variant: 'outlined' as 'outlined' | 'standard' | 'filled' },

  EmailLinkProps: {
    sx: { textAlign: 'center' } as SxProps,
    color: 'primary' as 'inherit' | 'primary' | 'error' | 'success' | 'warning' | 'info' | 'secondary',
    variant: 'body2' as Variant,
    underline: 'none' as "none" | "hover" | "always" | undefined,
  },
};

export default ProfileStyle;
