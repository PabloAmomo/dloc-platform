import { Box, CircularProgress, SxProps } from '@mui/material';
import style from './CircularLoading.style';

const CircularLoading = (props: CircularLoadingProps) => {
  const { position = 'relative', sx = {} as SxProps } = props;
  const sxPosition: SxProps = position === 'relative' ? {} as SxProps : style.PositionNoRelativeSx;
  const sxStyle: SxProps = style.ContainerProps.sx ?? {} as SxProps;

  return (
    <Box sx={{ ...sxStyle , ...sxPosition , ...sx as any }}>
      <CircularProgress />
    </Box>
  );
};

export default CircularLoading;

interface CircularLoadingProps {
  position?: 'absolute' | 'relative' | 'fixed';
  sx?: SxProps;
}
