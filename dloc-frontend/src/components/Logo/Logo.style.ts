import { SxProps } from '@mui/material';
import { ElementType } from 'react';

const LogoStyle = {
  ContainerProps: {
    component: 'img' as ElementType,
  },
  ContainerSx: (size: number): SxProps => ({
    height: size,
    width: size,
    maxHeight: { xs: size, md: size },
    maxWidth: { xs: size, md: size },
  }),
};

export default LogoStyle;
