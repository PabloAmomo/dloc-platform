import { SxProps } from "@mui/material";

const CircularLoadingStyle = {
  ContainerProps: {
    sx: {
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      backgroundColor: '#00000080',
      justifyContent: 'center',
    } as SxProps,
  },
  PositionNoRelativeSx: { top: 0, left: 0, bottom: 0, right: 0 } as SxProps,
};

export default CircularLoadingStyle;
