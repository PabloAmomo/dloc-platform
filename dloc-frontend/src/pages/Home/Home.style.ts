import { Colors } from "enums/Colors";
import { ElementType } from "react";
import { SxProps } from "@mui/material";

const HomeStyle = {
  ContainerProps: { sx: { bottom: 0 } as SxProps },
  TypographyProps: {  variant:"h4" as any, component: "h1" as ElementType, gutterBottom: true, sx: { textAlign: 'center', width: '100%', justifyContent: 'center', pt: 2, color: Colors.white } as SxProps },
  MainContainerProps: {
    sx: {
      width: '100vw',
      height: '100%',
      display: 'flex',
      // Background image
      backgroundImage: 'url("images/home-background.webp")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      // Sup border
      ':before': {
        content: "''",
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: '100vh',
        height: '40vh',
        top: 'var(--top-menu-height)',
        background: '#607d8b',
        borderRadius: '50%',
        transformOrigin: 'bottom',
        transform: 'translateX(-50%) scale(4)',
        zIndex: -1,
      },
      ':after': {
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'var(--top-menu-height)',
        background: Colors.white,
        transform: 'translateY(-100%)',
        zIndex: 0,
      },
    } as SxProps,
  },
};

export default HomeStyle;
