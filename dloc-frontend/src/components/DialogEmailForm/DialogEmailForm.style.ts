import { SxProps } from "@mui/material";

const DialogEmailFormStyle = {
  DialogTitleIconProps: {
    sx: { pr: 1, pt: '4px' } as SxProps,
    color: 'primary' as "disabled" | "action" | "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
  },
  DialogTitleTextProps: {
    sx: { flexGrow: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', mr: '1.25rem' } as SxProps,
  },
  DialogTitleProps: {
    sx: { display: 'flex', flexWrap: 'nowrap', flexDirection: 'row' } as SxProps,
  },
};

export default DialogEmailFormStyle;
