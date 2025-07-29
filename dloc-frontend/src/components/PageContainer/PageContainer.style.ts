import { SxProps } from "@mui/material";

const PageContainerStyle = {
  ContainerProps: {
    sx: {
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      top: 'var(--top-menu-height)',
      left: 0,
      right: 0,
      bottom: 'var(--bottom-menu-height)',
      justifyContent: 'normal',
      alignItems: 'center',
    } as SxProps,
  },
};

export default PageContainerStyle;
