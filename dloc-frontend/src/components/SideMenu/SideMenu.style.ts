import { AriaRole } from 'react';
import { Colors } from 'enums/Colors';
import { SxProps } from '@mui/material';

const SideMenuStyle = {
  IconColor: Colors.blue,

  MenuIconProps: {
    edge: "start" as false | "start" | "end" | undefined, 
    color: "inherit" as "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning",
    role: "menu" as AriaRole
  },

  DrawerProps: {
    sx: { zIndex: 1300 } as SxProps,
    anchor: 'right' as 'left' | 'top' | 'right' | 'bottom',
  },
  MenuContainerProps: {
    sx: { width: 250, height: '100vh' } as SxProps,
    role: 'presentation' as AriaRole,
  },
  MenuCloseButton: {
    sx: { mr: 1 } as SxProps,
  },
  MenuCloseButtonContainer: {
    sx: { width: '100%', pt: 1, textAlign: 'end' } as SxProps,
  },
};

export default SideMenuStyle;
