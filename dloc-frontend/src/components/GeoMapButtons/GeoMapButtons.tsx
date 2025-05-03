import { Box, SxProps } from '@mui/material';
import { Device } from 'models/Device';
import { filterDevices } from 'functions/filterDevices';
import { useDevicesContext } from 'providers/DevicesProvider';
import { useEffect } from 'react';
import { useMapContext } from 'providers/MapProvider';
import FilterCenterFocusIcon from '@mui/icons-material/FilterCenterFocus';
import GeoMapButton from 'components/GeoMapButton/GeoMapButton';
import GeoMapDeviceButton from 'components/GeoMapDeviceButton/GeoMapDeviceButton';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import RampLeftIcon from '@mui/icons-material/RampLeft';
import style from './GeoMapButtonsStyle.style';
import { CenterMapOnType } from 'enums/CenterMapOnType';

const getButtonItemSx = (isActive: boolean): SxProps => {
  const sx : SxProps = style.ButtonItem[isActive ? 'sxSelect' : 'sxUnselect'];
  const { color } = sx as any;
  return { ...sx, '& svg': { color } };
};

const GeoMapButtons = () => {
  const { devices } = useDevicesContext();
  const { showPath, setShowPath, centerMapOn, setCenterMapOn, showDevices, setMapMoved, mapMoved, isUserAction, minutes, setMinutes, closeAllTooltips } = useMapContext();

  /** Set automatic bounds  */
  const clickCenterBounds = () => {
    closeAllTooltips();
    setCenterMapOn(centerMapOn.type === CenterMapOnType.all ? { type: CenterMapOnType.none } : { type: CenterMapOnType.all });
    isUserAction.current = true;
    if (mapMoved) setMapMoved(false);
  };

  /** Center on Device  */
  const clickCenterOnDevice = (device: Device) => {
    closeAllTooltips();
    setCenterMapOn(centerMapOn.device?.imei === device.imei ? { type: CenterMapOnType.none } : { type: CenterMapOnType.device, device });
    isUserAction.current = true;
    if (mapMoved) setMapMoved(false);
  };

  /** Center on my position  */
  const clickCenterMyPosition = () => {
    closeAllTooltips();
    setCenterMapOn(centerMapOn.type === CenterMapOnType.myPosition ? { type: CenterMapOnType.none } : { type: CenterMapOnType.myPosition });
    isUserAction.current = true;
    if (mapMoved) setMapMoved(false);
  };

  /** Show or hide path  */
  const clickShowPath = () => {
    if (!showPath && minutes === 0) { setMinutes(5); }
    setShowPath(!showPath);
  }

  /** Release centerOn if device is showing */
  useEffect(() => {
    if (centerMapOn.type === 'device') {
      const showingDevices = filterDevices(devices, showDevices);
      if (!showingDevices.find((device) => device.imei === centerMapOn?.device?.imei)) setCenterMapOn({ type: CenterMapOnType.none });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, centerMapOn, showDevices]);

  return (
    <Box {...style.ContainerProps}>
      <Box {...style.ContainerPropsChild.left}>
          {filterDevices(devices, showDevices).map((device) => (
          <GeoMapDeviceButton
            {...style.ButtonDevice.props}
            device={device}
            key={device.imei}
            onClick={clickCenterOnDevice}
            isActive={centerMapOn?.device?.imei === device.imei}
            sxSelected={style.ButtonDevice.sxSelect}
            sxUnselected={style.ButtonDevice.sxUnselect}
          />
        ))}
      </Box>

      <Box {...style.ContainerPropsChild.right}>
        <Box {...style.ContainerPropsChild.rightInner}>
          {/* show path */}
          <GeoMapButton ariaLabel="show path" onClick={clickShowPath} sx={getButtonItemSx(showPath)}>
            <RampLeftIcon fontSize="inherit" />
          </GeoMapButton>

          {/* Center on on bounds */}
          <GeoMapButton ariaLabel="center in bound" onClick={clickCenterBounds} sx={getButtonItemSx(centerMapOn.type === 'all')}>
            <FilterCenterFocusIcon fontSize="inherit" />
          </GeoMapButton>

          {/* center on my position */}
          <GeoMapButton ariaLabel="center on my position" onClick={clickCenterMyPosition} sx={getButtonItemSx(centerMapOn.type === 'myPosition')}>
            <PersonPinCircleIcon fontSize="inherit" />
          </GeoMapButton>
        </Box>
      </Box>
    </Box>
  );
};

export default GeoMapButtons;
