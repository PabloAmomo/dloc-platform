import { MenuProps, SxProps } from '@mui/material';

const DevicesSelectorStyle = {
  ContainerProps: {
    sx: { display: 'flex', flexDirection: 'row', alignItems: 'center' } as SxProps,
  },
  ChipProps: {
    sx: { fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '14ch' } as SxProps,
  },
  ChipContainerProps: {
    sx: { display: 'flex', flexWrap: 'wrap', gap: 0.5 } as SxProps,
  },
  FormControlProps: {
    sx: {
      minWidth: '180px',
      '& label.MuiFormLabel-root': { transition: 'all .5s', marginTop: '8px' },
      '& label.MuiFormLabel-root.Mui-focused': { color: 'inherit' },
      '& .MuiSelect-select': { paddingBottom: 0 },
      '& .MuiChip-root': { transform: 'translatey(-4px)' },
    } as SxProps,
  },
  NameProps: {
    sx: { '& .MuiTypography-root': { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '14ch' } } as SxProps,
  },
  SelectProps: {
    displayEmpty: true,
    multiple: true,
    autoWidth: true,
    sx: {
      '& .MuiSelect-select': { paddingTop: '8px', ariaLabel: 'selector' },
      '& fieldset': { border: 0, borderWidth: '0!important' },
      '& .MuiBox-root': { justifyContent: 'end' },
    } as SxProps,
    MenuProps: { PaperProps: { style: { minWidth: 200, maxWidth: 250 } } } as MenuProps,
  },
};

export default DevicesSelectorStyle;
