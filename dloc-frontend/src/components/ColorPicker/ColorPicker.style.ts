import { CSSProperties } from 'react';
import { SxProps } from '@mui/material';

const ColorPickerStyle = {
  MenuItemContainerProps: {
    sx: { display: 'flex', alignItems: 'center' } as SxProps,
  },
  ColorName: {
    style: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    } as CSSProperties,
  },
  ColorIcon: {
    style: (value: string, disabled: boolean): CSSProperties => ({
      backgroundColor: value,
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      marginRight: '12px',
      opacity: disabled ? 0.3 : 1,
      aspectRatio: '1/1',
    }),
  },
  SelectProps: {
    sx: { '& .MuiSelect-select': { p: '12px 12px' } } as SxProps,
  }
};

export default ColorPickerStyle;
