import { SxProps } from "@mui/material";
import { CSSProperties } from "react";

const LastUpdateInfoStyle = {
  ContainerProps: {
    sx: {
      display: 'flex',
      alignContent: 'center',
      position: 'absolute',
      bottom: '.25rem',
      left: '.25rem',
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      p: '0 4px 0 4px',
      borderRadius: '4px',
    } as SxProps,
  },
  TypographyProps: {
    sx: { fontSize: '0.75rem', color: 'textSecondary', variant: 'caption' } as SxProps,
  },
  ErrorSpanProps: {
    style: { fontSize: '0.75rem', color: 'textSecondary', variant: 'caption' } as CSSProperties,
  },
};

export default LastUpdateInfoStyle;
