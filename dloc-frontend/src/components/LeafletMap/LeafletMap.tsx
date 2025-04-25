import 'leaflet/dist/leaflet.css';
import 'styles/leafletMap.style.css';
import { AccessAlarmTwoTone } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { CircleMarker, FeatureGroup, MapContainer, Polyline, Popup, TileLayer } from 'react-leaflet';
import { configApp } from 'config/configApp';
import { Device } from 'models/Device';
import { filterDevices } from 'functions/filterDevices';
import { MapArrow, MapArrowMarker } from 'models/MapArrow';
import { Marker } from 'react-leaflet';
import { useDevicesContext } from 'providers/DevicesProvider';
import { useMapContext } from 'providers/MapProvider';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import convertUTCDateToLocalDate from 'functions/convertUTCDateToLocalDate';
import formatDate from 'functions/formatDate';
import isTouchScreenDevice from 'functions/isTouchScreenDevice';
import LeafletMapHook from 'hooks/LeafletMapHook';
import LeafletMapMarker from 'components/LeafletMapMarker/LeafletMapMarker';
import React, { useCallback, useEffect } from 'react';
import SpeedIcon from '@mui/icons-material/SpeedTwoTone';
import style from './LeafletMap.style';

const ENABLE_HIDE_TOOLTIP = false;

const LeafletMap = () => {
  const [hideTooltip, setHideTooltip] = React.useState<boolean>(false);
  const { devices } = useDevicesContext();
  const { myPosition, setMap, map, showDevices, centerMapOn } = useMapContext();
  const { polylines, mapArrows } = LeafletMapHook();
  const { t } = useTranslation();
  const { user } = useUserContext();
  const centerOnImei: string | undefined = centerMapOn?.device?.imei;

  useEffect(() => {
    const devicesCount = (showDevices ?? []).includes('0') ? devices?.length ?? 0 : showDevices.length;
    setHideTooltip(devicesCount <= 1 && ENABLE_HIDE_TOOLTIP);
  }, [devices, showDevices]);

  const getOpacity = useCallback((imei: string, opacity: number): number => (!centerOnImei || centerOnImei === imei ? 1 : opacity / 2), [centerOnImei]);

  const getCustomPopup = (arrow: MapArrow, dateTimeUTC: string): React.ReactNode => {
    const speedKm = arrow.speed * 3.6;
    const dateFormated: string = formatDate(convertUTCDateToLocalDate(dateTimeUTC), t('dateString')) ?? '';
    return (
      <>
        <Box {...style.ArrowIconPopup.Container}>
          <AccessAlarmTwoTone {...style.ArrowIconPopup.Icon} />
          <Typography {...style.ArrowIconPopup.Typography}>{dateFormated}</Typography>
        </Box>
        {speedKm > 0 && (
          <Box {...style.ArrowIconPopup.Container}>
            <SpeedIcon {...style.ArrowIconPopup.Icon} />
            <Typography {...style.ArrowIconPopup.Typography}>{`${speedKm.toFixed(2)} ${t('averagekm/h')}`}</Typography>
          </Box>
        )}
      </>
    );
  };

  const getPopUp = (arrow: MapArrow, dateTimeUTC: string): React.ReactNode => (
    <Popup className="show-close" interactive>
      {getCustomPopup(arrow, dateTimeUTC)}
    </Popup>
  );

  /** Render */
  return (
    <Box sx={{ ...style.ContainerSx  }}>
      <MapContainer
        {...style.MapContainerProps}
        center={configApp.map.initCenter}
        zoom={configApp.map.initZoom}
        zoomControl={!isTouchScreenDevice()}
        scrollWheelZoom={true}
        ref={setMap}
      >
        <TileLayer url={`${configApp.map.template}`} />

        {/* Device Markers */}
        {filterDevices(devices, showDevices)
        .filter(
          (device: Device) => device.lat && device.lng
        ).map((device: Device) => (
          <LeafletMapMarker
            driftTime={configApp.map.driftMarkerTime}
            clickOnPopup={() => map && map.closePopup()}
            device={device}
            iconColor={device.params.markerColor}
            iconType={device.params.endTrack}
            key={`${device.imei}`}
            topMost={centerOnImei === device.imei}
            opacity={!centerOnImei || centerOnImei === device.imei ? 1 : configApp.deviceUnselectedOpacity}
            position={{ lat: device.lat ?? 0, lng: device.lng ?? 0 }}
            setIconOn="tooltip"
            zIndexOffset={1000}
            hideTooltip={hideTooltip}
          />
        ))}

        {/* My Position Marker */}
        {myPosition && user && (
          <LeafletMapMarker
            driftTime={configApp.map.driftMarkerTime}
            iconColor={user.profile.iconColor}
            iconType={user.profile.iconOnMap}
            key={`marker-${user.profile.id}`}
            position={myPosition}
            setIconOn="marker"
          />
        )}

        <FeatureGroup>
          {/* Polylines */}
          {polylines &&
            polylines.map((polyline) => (
              <Polyline
                interactive
                key={polyline.imei}
                pathOptions={{
                  ...style.PolilyneStyle,
                  color: polyline.color,
                  opacity: !centerOnImei || centerOnImei === polyline.imei ? polyline.opacity : polyline.opacity / 2,
                }}
                positions={polyline.path}
              />
            ))}

          {/* Path Start Marker */}
          {mapArrows &&
            mapArrows.map((arrow: MapArrow) =>
              arrow.markers.map((marker: MapArrowMarker) =>
                marker.type === 'start' ? (
                  // ------------------------------------------------
                  // Start Icon
                  // ------------------------------------------------
                  <LeafletMapMarker
                    driftTime={configApp.map.driftMarkerTime}
                    iconColor={arrow.color}
                    iconType={marker.icon}
                    key={`${arrow.imei}-${marker.type}`}
                    position={marker.position}
                    setIconOn="marker"
                    zIndexOffset={1100}
                    opacity={getOpacity(arrow.imei, arrow.opacity)}
                    customPopupMessage={marker?.position?.dateTimeUTC ? getCustomPopup(arrow, marker.position.dateTimeUTC) : null}
                  />
                ) : marker.type === 'point' ? (
                  // ------------------------------------------------
                  // Point Icon
                  // ------------------------------------------------
                  <CircleMarker
                    interactive
                    pathOptions={{ color: arrow.color, opacity: getOpacity(arrow.imei, arrow.opacity) }}
                    key={`${arrow.imei}-${marker.type}-${marker.position.dateTimeUTC}`}
                    center={{ ...marker.position }}
                    radius={1}
                  >
                    {marker?.position?.dateTimeUTC && getPopUp(arrow, marker.position.dateTimeUTC)}
                  </CircleMarker>
                ) : (
                  // ------------------------------------------------
                  // Arrow Icon
                  // ------------------------------------------------
                  <Marker
                    opacity={getOpacity(arrow.imei, arrow.opacity)}
                    icon={marker.icon}
                    key={`${arrow.imei}-${marker.type}-${marker.position.dateTimeUTC}`}
                    position={marker.position}
                    zIndexOffset={100}
                  >
                    {marker?.position?.dateTimeUTC && getPopUp(arrow, marker.position.dateTimeUTC)}
                  </Marker>
                )
              )
            )}
        </FeatureGroup>
      </MapContainer>
    </Box>
  );
};

export default LeafletMap;
