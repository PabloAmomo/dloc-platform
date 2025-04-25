import { SxProps } from "@mui/material";

const LayoutStyle = {
  MenuTopProps: {
    sx: { position: "fixed", display: "flex", top: 0, left: 0, right: 0, height: 'var(--top-menu-height)', boxShadow: 6, zIndex: "modal" } as SxProps
  }
};

export default LayoutStyle;
