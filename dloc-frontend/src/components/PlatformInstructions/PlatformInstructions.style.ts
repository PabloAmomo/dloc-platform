import { SxProps } from '@mui/material';
import { CSSProperties } from 'react';

const PlatformInstructionsStyle = {
  DialogTitleProps: {
    sx: { m: 0, fontSize: '1.4rem', pb: 0 } as SxProps,
  },
  TitleImageProps: {
    style: { boxShadow: '2px 2px 10px #d2d2d2', borderRadius: '8px' } as CSSProperties,
  },
};

export default PlatformInstructionsStyle;
