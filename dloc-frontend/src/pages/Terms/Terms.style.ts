import { ElementType } from "react";
import { SxProps } from "@mui/material";

const TermsStyle = {
  ContainerProps: { sx: { p: 1 } as SxProps },
  TypographyTitleProps: {  variant:"h4" as any, component: "h1" as ElementType, gutterBottom: true, sx: { textAlign: 'center', width: '100%', justifyContent: 'center', pt: 2 } as SxProps },
  TypographyContentProps: {  variant:"body" as any, sx: { textAlign: 'center', width: '100%', justifyContent: 'center', pt: 2 } as SxProps },
};

export default TermsStyle;
