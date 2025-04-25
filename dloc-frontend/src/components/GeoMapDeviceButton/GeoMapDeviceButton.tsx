import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { Device } from 'models/Device';
import GeoMapDeviceButtonStyle from './GeoMapDeviceButton.style';
import Located from '@mui/icons-material/MyLocation';
import UnLocated from '@mui/icons-material/GpsOff';
import { Colors } from 'enums/Colors';

const GeoMapDeviceButton = (props: GeoMapDeviceButtonProps) => {
  const { device, onClick, isActive, sxSelected, sxUnselected } = props;
  const buttonSx: SxProps = isActive ? sxSelected : sxUnselected;
  const isLocated = device.lat && device.lng;
  const buttonColor = (buttonSx as any).color ?? 'inherit';
  const cursor: string = isLocated ? (buttonSx as any)?.cursor ?? 'pointer' : 'not-allowed';
  const opacity: number = isLocated ? (buttonSx as any)?.opacity ?? 1 : 0.6;

  const clickOnDevice = () => {
    if (isLocated) onClick(device);
  };

  return (
    <Box key={device.imei} sx={{ ...buttonSx, opacity }}>
      <IconButton onClick={clickOnDevice} sx={{ cursor }} size="large" aria-label={device.params.name}>
        {isLocated ? <Located fontSize={'small'} htmlColor={buttonColor} /> : <UnLocated fontSize={'small'} htmlColor={Colors.red} />}

        <Typography variant="caption" color={buttonColor} ml={1} sx={GeoMapDeviceButtonStyle.TextEllipsis}>
          {device.params.name}
        </Typography>
      </IconButton>
    </Box>
  );
};

export default GeoMapDeviceButton;

interface GeoMapDeviceButtonProps {
  device: Device;
  isActive: boolean;
  onClick: (device: Device) => void;
  sxSelected: SxProps;
  sxUnselected: SxProps;
}
