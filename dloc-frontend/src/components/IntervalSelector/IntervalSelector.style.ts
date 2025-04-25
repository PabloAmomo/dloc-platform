import { SxProps } from "@mui/material";

const IntervalSelectorStyle = {
  ContainerProps: {
    sx: { display: 'flex', flexDirection: 'row', alignItems: 'center' } as SxProps,
  },
  RestoreIconContainerProps: {
    sx: { paddingTop: '6px', paddingLeft: '12px' } as SxProps,
  },
  SelectProps: {
    sx: { 
      '& .MuiSelect-select': { ariaLabel: 'selector' },
      '& fieldset': { border: 0, borderWidth: '0!important' } } as SxProps,
  },
  RestoreIcon: { sx: (disabled: boolean) : SxProps => ({ fontSize: '32px', opacity: disabled ? 0.25 : 0.75 }) },
};

export default IntervalSelectorStyle;
