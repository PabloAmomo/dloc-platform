import { Box, Checkbox, Chip, FormControl, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { Device } from 'models/Device';
import { DeviceParams } from 'models/DeviceParams';
import { ReactNode, useRef } from 'react';
import { useDevicesContext } from 'providers/DevicesProvider';
import { useMapContext } from 'providers/MapProvider';
import { useTranslation } from 'react-i18next';
import style from './DevicesSelector.style';
import IconMarker from 'components/IconMarker/IconMarker';

const DevicesSelector = (props: DevicesSelectorProps) => {
  const { devices } = useDevicesContext();
  const { disabled = false } = props;
  const { showDevices, setShowDevices, isUserAction } = useMapContext();
  const { t } = useTranslation();
  const isDisabled = disabled || (devices ?? []).length <= 1;
  const labelAll = t('all');
  const labelNone = t('none');
  const refHidden = useRef<any>();

  const onChange = (event: SelectChangeEvent<typeof showDevices>) => {
    const { value } = event.target;
    let updatedShowDevices: string[] = typeof value === 'string' ? value.split(',') : value;

    // All Selected
    if (updatedShowDevices.includes('0') && !showDevices.includes('0')) updatedShowDevices = ['0'];
    // None Selected
    else if (!updatedShowDevices.includes('0') && showDevices.includes('0')) updatedShowDevices = [];
    // Some Selected
    else if (updatedShowDevices.includes('0') && updatedShowDevices.length > 1) {
      /** Unselect one from All Selected */
      updatedShowDevices = updatedShowDevices.filter((item: string) => item !== '0');
      (devices ?? []).forEach((item: Device) => updatedShowDevices[0] !== item.imei && updatedShowDevices.push(item.imei));
      updatedShowDevices = updatedShowDevices.filter((item: string) => updatedShowDevices[0] !== item);
    }
    // All Selected
    else if (!updatedShowDevices.includes('0') && updatedShowDevices.length === (devices ?? []).length) updatedShowDevices = ['0'];

    /** Set Show Devices */
    isUserAction.current = true;
    setShowDevices(updatedShowDevices);
  };

  /** Create Chips to render */
  const renderChips = (selected: string[]): ReactNode => {
    const itemsData: chipItem[] = [];

    /** Select what to show */
    if (selected.includes('0')) itemsData.push({ imei: '0', name: labelAll });
    else if (selected.length === 0) itemsData.push({ imei: '0', name: labelNone });
    else
      (devices ?? []).forEach((item: Device) => {
        if (selected.includes(item.imei)) itemsData.push({ imei: item.imei, name: item.params.name });
      });

    /** Create Chips */
    return (
      <Box {...style.ChipContainerProps}>
        {itemsData.map((item: chipItem) => (
          <Chip key={item.imei} label={item.name} {...style.ChipProps} />
        ))}
      </Box>
    );
  };

  /** Create List of Devices, including "all" to create the checkbox list */
  const createListOfDevices = () => {
    const itemsData: { imei: string; name: string; params: DeviceParams | undefined; isShared: boolean }[] = [
      /** Add all */
      { imei: '0', name: labelAll, params: undefined, isShared: false },
    ];

    /** Select what to show */
    (devices ?? []).forEach((item: Device) => {
      itemsData.push({ imei: item.imei, name: item.params.name, params: item.params, isShared: item.isShared });
    });

    return itemsData;
  };

  /** Render */
  return (
    <Box {...style.ContainerProps}>
      <Box>
        <FormControl aria-label={t('pets')} ref={refHidden} {...style.FormControlProps}>
          <Select {...style.SelectProps} disabled={isDisabled} value={showDevices} onChange={onChange} renderValue={renderChips} aria-label={t('pets')}>
            {/* Items Devices and All */}
            {createListOfDevices().map(({ imei, name, params, isShared }) => (
              <MenuItem aria-label={name} key={imei} value={imei}>
                {/* Checkbox */}
                <Checkbox checked={showDevices.includes(imei) || showDevices.includes('0')} />

                {/* ICON */}
                <ListItemIcon sx={{ '&.MuiListItemIcon-root': params ? {} : { minWidth: '0!important' } }}>
                  {
                    params && (<IconMarker  iconType={params.endTrack} fillColor={params.markerColor} hasImage={params.hasImage} imei={imei} isShared={isShared} sharedWithOthers={params.sharedWiths?.length > 0}  size={28} />)
                  }
                </ListItemIcon>

                {/* NAME */}
                <ListItemText {...style.NameProps} primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default DevicesSelector;

interface chipItem {
  imei: string;
  name: string;
}

interface DevicesSelectorProps {
  disabled?: boolean;
}
