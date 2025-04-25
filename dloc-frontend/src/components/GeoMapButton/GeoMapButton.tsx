import { Box, IconButton, SxProps } from '@mui/material';

const GeoMapButton = (props: GeoMapButtonProps) => {
  const { onClick, sx, children, ariaLabel } = props;
  return (
    <Box sx={sx}>
      <IconButton aria-label={ariaLabel ?? ''} onClick={onClick} size="large">
        {children}
      </IconButton>
    </Box>
  );
};

export default GeoMapButton;

interface GeoMapButtonProps {
  ariaLabel?: string;
  children: React.ReactNode;
  onClick: () => void;
  sx: SxProps;
}
