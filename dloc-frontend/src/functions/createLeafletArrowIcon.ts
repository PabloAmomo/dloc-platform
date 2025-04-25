import { IconType } from "enums/IconType";
import L from 'leaflet';
import getMarkerIcon from "./getMarkerIcon";

const createLeafletArrowIcon = (color: string, opacity: number, bearing: number): L.DivIcon => {
  const iconSize: [number, number] = [8, 8];
  const iconAnchor: [number, number] = [4, 9];
  const iconUrl = getMarkerIcon(IconType.arrow, { fillColor: color, size: iconSize[0] });
  
  return L.divIcon({
    className: 'leaflet-arrow-icon',
    html: `<div style="color: ${color}; opacity: ${opacity}; transform: rotate(${Math.floor(bearing)}deg)"><img src='${iconUrl}' style='width: ${iconSize[0]}px; height: ${iconSize[1]}px' /></div>`,
    iconSize,
    iconAnchor,
  });
};

export default createLeafletArrowIcon;