import { SxProps } from "@mui/material";

const ContainerTopStyle = {
  Container: {
    sx: (height:number) : SxProps => ({
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100vw',
      height: `${height}px`,
      overflow: 'hidden',
      transition: '.5s all',
    }),
  },
};

export default ContainerTopStyle;
