import { SxProps } from "@mui/material";
import { ElementType } from "react";

const LanguageSelectorStyle = {
  MenuItemContainerProps: {
    sx: { display: 'flex', alignItems: 'center' } as SxProps,
  },
  ImageProps: {
    sx: { width: '24px', height: '24px', marginRight: '8px' } as SxProps,
    component: "img" as ElementType,
  },
};

export default LanguageSelectorStyle;
