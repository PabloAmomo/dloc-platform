import { SxProps } from "@mui/material";

const GeoMapBottomMenuStyle = {
  ContainerProps: {
    sx: {
      pl: 1,
      pr: 1,
      display: 'flex',
      position: 'fixed',
      justifyContent: 'center',
      flexDirection: 'column',
      height: 'var(--bottom-menu-height)',
      width: '100%',
      zIndex: 'modal',
      left: 0,
      bottom: 0,
      right: 0,
      boxShadow: '0px -3px 5px 1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
    } as SxProps,
  },
  MainGridProps: { container: true, spacing: 2, sx: { flexWrap: 'nowrap' } as SxProps },

  IntervalSelectorProps: { sx: { pl: '12px!important', pt: '0!important' } as SxProps },

  GridMiddleSpaceProps: { sx: { flexGrow: '1!important', display: 'flex', pl: '0!important', pr: '0!important' } as SxProps },

  DevicesSelectorProps: { sx: { pr: '12px!important', pt: '8px!important' } as SxProps },
};

export default GeoMapBottomMenuStyle;
