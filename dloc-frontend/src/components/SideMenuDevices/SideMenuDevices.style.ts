import { SxProps } from '@mui/material';
import { Colors } from 'enums/Colors';

const SideMenuDevicesStyle = {
  TextProps: {
    sx: { '& .MuiListItemText-primary': { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '16ch' } } as SxProps,
  },

  NoDeviceTypographyProps: { sx: { pt: 1, textAlign: 'center', color: 'GrayText', fontStyle: 'italic' } as SxProps },

  IconColor: Colors.blue,
};

export default SideMenuDevicesStyle;
