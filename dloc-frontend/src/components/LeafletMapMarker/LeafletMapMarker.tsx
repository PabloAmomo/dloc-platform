import { Device } from 'models/Device';
import { IconType } from 'enums/IconType';
import { LatLng } from 'models/LatLng';
import { Popup, Tooltip } from 'react-leaflet';
import { useRef } from 'react';
import getMarkerIcon from 'functions/getMarkerIcon';
import L from 'leaflet';
import MapMarkerLabel from 'components/MapMarkerLabel/MapMarkerLabel';
import MapMarkerPopup from 'components/MapMarkerPopup/MapMarkerPopup';
import ReactLeafletDriftMarker from 'react-leaflet-drift-marker';
import style from './LeafletMapMarker.style';

const LeafletMapMarker = (props: LeafletMapMarkerProps) => {
  const { iconSize = style.IconSize, iconType, position, iconColor, zIndexOffset, device, topMost } = props;
  const { clickOnPopup, setIconOn, opacity = 1, driftTime, customPopupMessage, hideTooltip = false } = props;
  const iconAnchor: [number, number] = [iconSize[0] / 2, iconSize[1]];
  const refPopup = useRef<any>();
  const refTooltip = useRef<any>();
  const refMarker = useRef<any>();
  const icon = L.icon({
    iconUrl: setIconOn === 'tooltip' ? style.BlankIcon : getMarkerIcon(iconType, { fillColor: iconColor, size: iconSize[0] }),
    iconSize: setIconOn === 'tooltip' ? [0, 0] : (iconSize as [number, number]),
    iconAnchor: setIconOn === 'tooltip' ? [0, 0] : iconAnchor,
  });

  /** To replace ReactLeafletDriftMarker, change the component to Marker (from react-leaflet) with the same props omitting duration */
  return (
    <ReactLeafletDriftMarker
      alt={`marker-${iconType}`}
      duration={driftTime}
      ref={refMarker}
      zIndexOffset={zIndexOffset}
      icon={icon}
      position={position}
      opacity={opacity}
    >
      {customPopupMessage && (
        <Popup className="show-close" interactive ref={refPopup}>
          {customPopupMessage}
        </Popup>
      )}
      {device && (
        <>
          <Popup interactive ref={refPopup}>
            {customPopupMessage ? customPopupMessage : <MapMarkerPopup onClick={clickOnPopup} zIndexOffset={zIndexOffset} device={device} />}
          </Popup>
          <Tooltip interactive ref={refTooltip} permanent direction={'bottom'}>
            {device && <MapMarkerLabel opacity={opacity} hideTooltip={hideTooltip} className={topMost ? 'marker-top-most' : ''} zIndexOffset={zIndexOffset} device={device} />}
          </Tooltip>
        </>
      )}
    </ReactLeafletDriftMarker>
  );
};

export default LeafletMapMarker;

interface LeafletMapMarkerProps {
  clickOnPopup?: () => void;
  customPopupMessage?: React.ReactNode;
  device?: Device;
  driftTime: number;
  hideTooltip?: boolean;
  iconColor: string;
  iconSize?: [number, number];
  iconType: IconType;
  opacity?: number;
  position: LatLng;
  setIconOn: 'marker' | 'tooltip';
  topMost?: boolean;
  zIndexOffset?: number;
}
