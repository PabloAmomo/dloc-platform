import { IconType } from "enums/IconType";
import { LatLng } from "./LatLng";

export interface MapArrow {
  imei: string;
  color: string;
  opacity: number;
  weight: number;
  markers: MapArrowMarker[];
  speed: number;
}

export  interface MapArrowMarker {
  type: 'start' | 'arrow' | 'point';
  position: LatLng;
  bearing: number;
  icon: any | IconType;
}