import { SxProps } from '@mui/material';
import { Colors } from 'enums/Colors';
import { CSSProperties } from 'react';

const ellipsis: SxProps = { textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' };

const MapMarkerLabelStyle = {
  containerProps: {
    sx: {
      display: 'flex',
      width: '72px',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontSize: '8px',
    } as SxProps,
  },
  IconMarkerProps: {
    sx: { position: 'absolute', left: '20px', top: '-40px' } as SxProps,
  },
  deviceNameProps: { sx: ellipsis },
  deviceLastPositionProps: { sx: ellipsis },
  batteryProps: {
    sx: { position: 'absolute', left: '-6px', top: '-26px' } as SxProps,
  },
  batteryTooltipHiddenProps: {
    sx: { position: 'absolute', left: '6px', top: '-30px' } as SxProps,
  },
  deviceOutOffVisibilityIconProps: {
    sx: { width: '12px', height: '12px', marginTop: '3px', color: Colors.white } as SxProps,
  },
  deviceOutOffVisibilityProps: {
    sx: {
      position: 'absolute',
      right: '-1px',
      top: '-24px',
      backgroundColor: Colors.red,
      borderRadius: '4px',
      width: '18px',
      height: '18px',
      textAlign: 'center',
      border: `1px solid ${Colors.white}`,
    } as SxProps,
  },
  deviceOutOffVisibilityTooltipHiddenProps: {
    sx: {
      position: 'absolute',
      right: '4px',
      top: '-27px',
      backgroundColor: Colors.red,
      borderRadius: '4px',
      width: '18px',
      height: '18px',
      textAlign: 'center',
      border: `1px solid ${Colors.white}`,
    } as SxProps,
  },
  
  batteryImageProps: (animation: boolean) => ({ style: { animation: animation ? 'blinker-25 1s linear infinite' : 'none' } as CSSProperties }),
};

export default MapMarkerLabelStyle;
