import { SxProps } from "@mui/material";
import { Colors } from "enums/Colors";
import { CSSProperties } from "react";

const IconMarkerStyle = {
  SharedTextProps: {
    color: 'primary',
    sx: { fontSize: '8px', position: 'absolute' } as SxProps,
  },
  MarkerIconProps: {
    style: { position: 'absolute', top: 0, left: 0, zIndex: 2 } as CSSProperties,
  },
  MarkerIconImageProps: {
    style: { position: 'absolute', left: 5, top: 1,borderRadius: '50%', zIndex: 1, backgroundColor: 'white' } as CSSProperties,
  },
  MarkerInternalContainerProps: {
    sx: { position: 'relative', width: '100%', height: '100%' } as SxProps,
  },
  MarkerIconHoldProps: {
    style: { position: 'absolute', right: 0, bottom: -2, zIndex: 1, color: Colors.gray, width: '10px', height: '10px' } as CSSProperties,
  },
};

export default IconMarkerStyle;
