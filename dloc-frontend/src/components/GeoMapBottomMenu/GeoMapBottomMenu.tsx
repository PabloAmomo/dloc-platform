import { Box, Grid } from '@mui/material';
import { useDevicesContext } from 'providers/DevicesProvider';
import { useMapContext } from 'providers/MapProvider';
import DevicesSelector from 'components/DevicesSelector/DevicesSelector';
import IntervalSelector from 'components/IntervalSelector/IntervalSelector';
import style from './GeoMapBottomMenu.style';

function GeoMapBottomMenu() {
  const { showPath, minutes, setMinutes } = useMapContext();
  const { devices } = useDevicesContext();

  return (
    <Box {...style.ContainerProps}>
      <Grid {...style.MainGridProps}>
        {/* Interval Selector */}
        <Grid item xs={'auto'} {...style.IntervalSelectorProps}>
          <IntervalSelector minutes={minutes} setMinutes={setMinutes} disabled={!showPath} />
        </Grid>

        <Grid item xs={'auto'} {...style.GridMiddleSpaceProps} />

        {/* Devices Selector */}
        {devices && devices.length > 1 && (
          <Grid item xs={'auto'} {...style.DevicesSelectorProps}>
            <DevicesSelector />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default GeoMapBottomMenu;
