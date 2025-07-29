import { SxProps } from "@mui/material";

const ContainerAllScreenStyle = {
  ContainerProps: {
    sx: { display: 'flex', position: 'relative', flexDirection: 'column', alignItems: 'center', height: '100%', width: '100%' } as SxProps,
  },
  ChildrenContainerProps: {
    sx: { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' } as SxProps,
  },
};

export default ContainerAllScreenStyle;
