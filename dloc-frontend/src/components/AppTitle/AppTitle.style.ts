import { SxProps } from "@mui/material";

const AppTitleStyle = {
  TitleProps: {
    sx: { pb: 0, fontSize: '36px', lineHeight: '36px', userSelect: 'none', color: 'black' } as SxProps,
  },
  SubtitleProps: {
    sx: { pb: 0, fontSize: '12px', lineHeight: '12px', userSelect: 'none', color: 'orange' } as SxProps,
  },
  BrandSpanAltProps: {
    style: { color: '#f06316' } as React.CSSProperties,
  },
};

export default AppTitleStyle;
