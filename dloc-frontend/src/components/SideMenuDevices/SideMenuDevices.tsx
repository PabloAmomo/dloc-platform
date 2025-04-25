import { AddLocationAlt, Map } from '@mui/icons-material';
import {  Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListItemTextProps, Typography } from '@mui/material';
import { Device, DeviceEmpty } from 'models/Device';
import { ReactNode } from 'react';
import { t } from 'i18next';
import { useDevicesContext } from 'providers/DevicesProvider';
import { useNavigate } from 'react-router-dom';
import style from './SideMenuDevices.style';
import IconMarker from 'components/IconMarker/IconMarker';

const SideMenuDevices = (props: SideMenuDevicesProps) => {
  const { clickOnDevice } = props;
  const { devices } = useDevicesContext();
  const navigate = useNavigate();

  const clickMap = () => navigate('/home');
  const clickDevice = (device?: Device) => clickOnDevice(device);

  const getListItem = (onClick: any, text: string, icon: ReactNode, textProps?: ListItemTextProps<'span', 'p'>, key?: string) => (
    <ListItem key={key} disablePadding>
      <ListItemButton onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={t(text)} {...textProps} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <>
      {/* Devices */}
      <List>
        {!devices || (devices?.length ?? 0) === 0 ? (
          <Typography variant="subtitle1" {...style.NoDeviceTypographyProps}>
            {t('noDevices')}
          </Typography>
        ) : (
          (devices ?? []).map((device: Device) =>
            getListItem(
              () => clickDevice(device),
              device.params.name,
              <IconMarker iconType={device.params.endTrack} hasImage={device.params.hasImage} fillColor={device.params.markerColor} imei={device.imei} isShared={device.isShared} sharedWithOthers={device?.params?.sharedWiths?.length > 0} size={28} />,
              style.TextProps,
              device.imei
            )
          )
        )}
      </List>
      <Divider />

      {/* Add device */}
      <List>{getListItem(() => clickDevice(DeviceEmpty()), 'addDevice', <AddLocationAlt htmlColor={style.IconColor} />)}</List>
      <Divider />

      {/* Goto to Map */}
      <List>{getListItem(clickMap, 'map', <Map htmlColor={style.IconColor} />)}</List>
      <Divider />
    </>
  );
};

export default SideMenuDevices;

interface SideMenuDevicesProps {
  clickOnDevice: { (device?: Device): void };
}
