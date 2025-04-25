import { Box, SxProps } from '@mui/material';
import style from './PageContainer.style';

const PageContainer = (props: PageContainerProps) => {
  const { children, sx = {} as any } = props;
  const sxStyle: SxProps = style.ContainerProps.sx ?? {};

  return <Box sx={{ ...sxStyle, ...sx }}>{children}</Box>;
};

export default PageContainer;

interface PageContainerProps {
  children: any;
  sx?: SxProps;
}
