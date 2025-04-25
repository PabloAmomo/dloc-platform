import { SxProps } from '@mui/material';
import { Colors } from 'enums/Colors';

const textEllipsis : SxProps = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' };
const iconSize : number = 12;

const MapMarkerPopupStyle = {
  AvatarProps: {
    sx: { width: { xs: 48, sm: 64, md: 72 }, height: { xs: 48, sm: 64, md: 72 }, bgcolor: 'white', '& img': { backgroundColor: 'white' } } as SxProps,
  },
  AvatarContainerProps: {
    sx: { display: 'flex', alignItems: 'center', justifyContent: 'center', pb: 1 } as SxProps,
  },
  ContainerProps: {
    sx: {
      display: 'flex',
      with: '280px',
      maxWidth: '280px',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontSize: '12px',
    } as SxProps,
  },

  ItemIconProp: {
    sx: { width: `${iconSize}px`, height: `${iconSize}px` } as SxProps,
  },

  VisibilityIconContainerProps: {
    sx: { position: 'absolute', right: -8, top: 0 } as SxProps,
  },

  SharedWithIconContainerProps: {
    sx: { position: 'absolute', left: 40, top: 0, opacity: .8 } as SxProps,
  },
  SharedWithIconProps: {
    sx: { width: `${iconSize}px`, height: `${iconSize}px` } as SxProps,
  },

  OpenConfigIconContainerProps: {
    sx: { position: 'absolute', right: 40, top: 0, opacity: .8 } as SxProps,
  },
  OpenConfigIconProps: {
    sx: { width: `${iconSize}px`, height: `${iconSize}px` } as SxProps,
  },

  BatteryIconContainerProps: {
    sx: { position: 'absolute', left: -10, top: 0 } as SxProps,
  },

  VisibilityIconProps: {
    WithVisibility: {
      sx: { width: `${iconSize}px`, height: `${iconSize}px`, color: Colors.green } as SxProps,
    },
    WithOutVisibility: {
      sx: { width: `${iconSize}px`, height: `${iconSize}px`, color: Colors.red } as SxProps,
    },
  },

  BatteryIconProps: { iconSize, fontSize: 10 },

  LineItem: {
    ContainerProps: { sx: { display: 'flex', flexDirection: 'row', width: '100%'  } as SxProps, },
    TitleSpanProps: { sx: { mr: 1 } as SxProps },
    ValueSpanProps: { sx: { ...textEllipsis, lineHeight: `${iconSize}px` } as SxProps },
  },

  NameContainerProps: { sx: { ...textEllipsis, textAlign: 'center', pb: 1 } as SxProps },

  LastTimeSx: {  } as SxProps,
  DistanceSx: {  } as SxProps,
  LastVisibilityProps: {  },
  PositionSx: {  } as SxProps,
};

export default MapMarkerPopupStyle;
