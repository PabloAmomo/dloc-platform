import { SxProps } from '@mui/material';
import { Colors } from 'enums/Colors';

const BrandLoginButtonStyle = {
  ButtonTextProps: {
    style: { paddingTop: '2px', fontSize: '12px', width: '100%', } as React.CSSProperties,
  },
  ButtonProps: {
    sx: { backgroundColor: Colors.white, width: '310px', color: '#3f51b5', '&:hover': { backgroundColor: '#f2f2f2' }, boxShadow: 3 } as SxProps,
  },
  StartIconProps: {
    sx: { width: 24, height: 24, ml: 1 } as SxProps,
  },
};

export default BrandLoginButtonStyle;
